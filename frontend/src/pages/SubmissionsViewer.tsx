import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Mini/Loader";
import Alert from "../components/Mini/Alert";
import { errorHandler } from "../helpers/responseHandler";
import type { FormDetail, FormField, Submission } from "../types";

interface ApiResponse {
  data: {
    form: FormDetail;
    submissions: Submission[];
  };
}

const formatCell = (value: unknown): string => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

export default function SubmissionsViewer() {
  const { id: formId } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormDetail | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>(
        `/api/forms/${formId}/submissions`,
      );
      setForm(res.data.data.form);
      setSubmissions(res.data.data.submissions);
    } catch (e) {
      errorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]);

  const fields: FormField[] = form?.fields ?? [];

  return (
    <div className="main-wrapper px-10 py-3 mx-auto">
      <Alert />
      {loading && <Loader message="Fetching submissions..." />}

      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="bg-slate-50 hover:bg-slate-100 font-light py-2 px-5 rounded-xl"
          >
            <i className="fas fa-arrow-left font-light"></i> Back
          </Link>
          <div>
            <h2 className="text-2xl font-bold">
              {form?.name || "Submissions"}
            </h2>
            <p className="text-gray-500 text-sm">
              {submissions.length} submission
              {submissions.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </header>

      {!loading && submissions.length === 0 ? (
        <div className="bg-white p-10 rounded-xl mt-4 flex flex-col items-center text-center border border-dashed">
          <i className="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
          <h3 className="font-bold text-lg">No submissions yet</h3>
          <p className="text-gray-500">
            Share the renderer link to start collecting responses.
          </p>
        </div>
      ) : !loading ? (
        <div className="bg-white rounded-xl overflow-x-auto shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">
                  Submitted at
                </th>
                {fields.map((f) => (
                  <th
                    key={f.id}
                    className="text-left py-2 px-3 font-semibold text-gray-700"
                  >
                    {f.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="py-2 px-3 text-gray-500 whitespace-nowrap">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  {fields.map((f) => (
                    <td key={f.id} className="py-2 px-3 text-gray-800">
                      {formatCell(s.data?.[f.name])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
