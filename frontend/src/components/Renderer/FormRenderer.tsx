import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import FieldRenderer from "./FieldRenderer";
import Loader from "../Mini/Loader";
import Alert from "../Mini/Alert";
import {
  errorHandler,
  successHandler,
  extractFieldErrors,
} from "../../helpers/responseHandler";
import {
  buildDefaultValues,
  buildSubmissionSchema,
} from "../../lib/buildSubmissionSchema";
import type { FormField } from "../../types";

export default function FormRenderer() {
  const { id: formId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);

  const schema = useMemo(() => buildSubmissionSchema(fields), [fields]);
  const defaultValues = useMemo(() => buildDefaultValues(fields), [fields]);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Record<string, unknown>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const fetchForm = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/forms/${formId}`);
      const { data } = res.data;
      setFormName(data?.name ?? "");
      setFormDesc(data?.description ?? "");
      setFields(data?.fields ?? []);
    } catch (err) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  const stripDataPrefix = (
    errs: Record<string, string[] | string>,
  ): Record<string, string> => {
    const stripped: Record<string, string> = {};
    for (const [key, value] of Object.entries(errs)) {
      const cleanKey = key.startsWith("data.") ? key.slice(5) : key;
      stripped[cleanKey] = Array.isArray(value) ? (value[0] ?? "") : value;
    }
    return stripped;
  };

  const onSubmit = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const res = await axios.post(`/api/forms/${formId}/submit`, {
        data: values,
      });
      successHandler(res.data.message);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      const fieldErrors = stripDataPrefix(extractFieldErrors(err));
      for (const [name, message] of Object.entries(fieldErrors)) {
        setError(name, { type: "server", message });
      }
      errorHandler(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-wrapper mx-auto py-4 basic-details">
      <header className="flex justify-between items-center mb-3">
        <div>
          <h1 className="font-bold text-2xl">Render form</h1>
          <p className="text-gray-500/80">
            Pick a form to fill out and submit.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-container shadow-lg rounded-lg overflow-hidden bg-white"
      >
        <Alert />
        {(loading || submitting) && <Loader />}

        <div className="card-header bg-gray-200 p-3">
          <h3 className="font-bold">{formName}</h3>
          <small className="text-gray-700">{formDesc}</small>
        </div>

        <div className="card-body p-3">
          {fields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              control={control}
              error={(errors[field.name]?.message as string | undefined) || ""}
            />
          ))}
        </div>

        <div className="card-footer bg-gray-200 p-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-transparent hover:bg-blue-500/20 text-blue-500 font-semibold py-1 px-4 border border-blue-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
