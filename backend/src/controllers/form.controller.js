import { prisma } from "../prisma.js";
import { validate } from "../lib/validate.js";
import { buildSubmissionSchema, formSchema } from "../lib/schemas.js";
import { asyncHandler } from "../lib/asyncHandler.js";
import { notFound, badRequest, forbidden } from "../lib/errors.js";

const reshapeForms = (form) => {
  if (!form) return form;
  const { _count, ...rest } = form;
  if (_count) {
    rest.fieldsCount = _count.fields;
    rest.submissionsCount = _count.submissions;
  }
  return rest;
};

const fieldToRow = (field, position) => ({
  label: field.label,
  name: field.name,
  dataType: field.dataType,
  placeholder: field.placeholder ?? null,
  helpText: field.helpText ?? null,
  options: field.options ?? null,
  validation: field.validation ?? null,
  isRequired: field.isRequired ?? false,
  position,
});

const formWithFields = (tx, id) =>
  tx.form.findUnique({
    where: { id },
    include: { fields: { orderBy: { position: "asc" } } },
  });

const parseId = (raw) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw badRequest("Invalid id");
  return id;
};

const loadOwnedForm = async (formId, userId) => {
  const form = await prisma.form.findUnique({ where: { id: formId } });
  if (!form) throw notFound("Form");
  if (form.userId !== userId) throw forbidden("You do not own this form");
  return form;
};

export const getAllForms = asyncHandler(async (req, res) => {
  const forms = await prisma.form.findMany({
    where: { userId: req.user.id },
    orderBy: { id: "desc" },
    include: { _count: { select: { fields: true, submissions: true } } },
  });
  res.status(200).json({ success: true, data: forms.map(reshapeForms) });
});

export const getFormById = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const form = await formWithFields(prisma, id);
  if (!form) throw notFound("Form");
  res.status(200).json({ success: true, data: form });
});

export const createForm = asyncHandler(async (req, res) => {
  const data = validate(formSchema, req.body);

  const form = await prisma.$transaction(async (tx) => {
    const created = await tx.form.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        isActive: data.isActive,
        userId: req.user.id,
      },
    });

    if (data.fields.length) {
      await tx.formField.createMany({
        data: data.fields.map((f, i) => ({
          ...fieldToRow(f, i),
          formId: created.id,
        })),
      });
    }

    return formWithFields(tx, created.id);
  });

  res.status(201).json({
    success: true,
    message: "Form created successfully",
    data: form,
  });
});

export const updateForm = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  await loadOwnedForm(id, req.user.id);

  const data = validate(formSchema, req.body);

  const form = await prisma.$transaction(async (tx) => {
    await tx.form.update({
      where: { id },
      data: {
        name: data.name,
        isActive: data.isActive,
        description: data.description ?? null,
      },
    });

    await tx.formField.deleteMany({ where: { formId: id } });

    if (data.fields.length) {
      await tx.formField.createMany({
        data: data.fields.map((f, i) => ({
          ...fieldToRow(f, i),
          formId: id,
        })),
      });
    }

    return formWithFields(tx, id);
  });

  res.status(200).json({
    success: true,
    message: "Form updated successfully",
    data: form,
  });
});

export const deleteForm = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  await loadOwnedForm(id, req.user.id);

  await prisma.form.delete({ where: { id } });
  res.status(200).json({ success: true, message: "Form deleted successfully" });
});

export const submitForm = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  const form = await formWithFields(prisma, id);
  if (!form) throw notFound("Form");
  if (!form.isActive) {
    throw badRequest("This form is not accepting submissions right now.");
  }

  const schema = buildSubmissionSchema(form.fields);
  const payload = validate(schema, { data: req.body?.data ?? {} });

  await prisma.formSubmission.create({
    data: { formId: id, data: payload.data },
  });

  res.status(201).json({
    success: true,
    message: "Form submitted successfully",
  });
});

export const getFormSubmissions = asyncHandler(async (req, res) => {
  const id = parseId(req.params.id);
  await loadOwnedForm(id, req.user.id);

  const form = await formWithFields(prisma, id);
  const submissions = await prisma.formSubmission.findMany({
    where: { formId: id },
    orderBy: { id: "desc" },
  });

  res.status(200).json({ success: true, data: { form, submissions } });
});
