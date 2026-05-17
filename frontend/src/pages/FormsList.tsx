import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Mini/Loader";
import Alert from "../components/Mini/Alert";
import ConfirmModal from "../components/Mini/ConfirmModal";
import { errorHandler, successHandler } from "../helpers/responseHandler";
import type { FormSummary } from "../types";

export default function FormsList() {
  const [formsList, setFormsList] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState("Fetching the forms...");
  const [pendingDelete, setPendingDelete] = useState<FormSummary | null>(null);

  const getForms = async () => {
    setLoaderMsg("Fetching the forms...");
    setLoading(true);
    try {
      const res = await axios.get("/api/forms");
      setFormsList(res.data.data);
    } catch (e) {
      errorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  const performDelete = async () => {
    const form = pendingDelete;
    setPendingDelete(null);
    if (!form) return;
    setLoaderMsg("Deleting the form...");
    setLoading(true);
    try {
      const res = await axios.delete(`/api/forms/${form.id}`);
      successHandler(res.data.message);
      await getForms();
    } catch (e) {
      errorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getForms();
  }, []);

  return (
    <div className="main-wrapper px-10 py-3 mx-auto">
      <Alert />
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Forms</h2>
          <p className="text-gray-500">Create and manage forms</p>
        </div>
        <Link to="/builder">
          <button
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-900 text-white disabled:bg-blue-200 disabled:cursor-not-allowed font-bold py-2 px-5 rounded-xl cursor-pointer"
          >
            + New form
          </button>
        </Link>
      </header>

      {loading ? (
        <Loader message={loaderMsg} />
      ) : formsList.length === 0 ? (
        <div className="bg-white p-10 rounded-xl mt-8 flex flex-col items-center text-center border border-dashed">
          <i className="fas fa-clipboard-list text-4xl text-gray-300 mb-3"></i>
          <h3 className="font-bold text-lg">No forms yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first form to start collecting submissions.
          </p>
          <Link to="/builder">
            <button className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-5 rounded-xl cursor-pointer">
              + Create form
            </button>
          </Link>
        </div>
      ) : (
        <ul>
          {formsList.map((form) => (
            <li
              key={form.id}
              className="bg-white p-4 rounded-xl mt-6 flex justify-between items-center"
            >
              <span className="flex flex-col gap-1 text-lg font-semibold">
                {form.name}
                <span className="text-gray-500 flex gap-2 font-light text-sm">
                  <span>{form.fieldsCount || 0} fields</span>•
                  <span>{form.submissionsCount || 0} submissions</span>•
                  <span
                    className={
                      form.isActive ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                </span>
              </span>
              <span className="flex gap-2">
                <Link to={`/submissions/${form.id}`}>
                  <button className="bg-transparent hover:bg-indigo-500/10 text-indigo-600 font-semibold py-1 px-4 border border-indigo-500 rounded-xl transition-all cursor-pointer">
                    Submissions
                  </button>
                </Link>
                <Link to={`/builder/edit/${form.id}`}>
                  <button className="bg-transparent hover:bg-gray-500/10 text-gray-500 font-semibold py-1 px-4 border border-gray-500 rounded-xl transition-all cursor-pointer">
                    Edit
                  </button>
                </Link>
                <Link to={`/renderer/${form.id}`}>
                  <button className="bg-transparent hover:bg-gray-500/10 text-gray-500 font-semibold py-1 px-4 border border-gray-500 rounded-xl transition-all cursor-pointer">
                    Open
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => setPendingDelete(form)}
                  className="bg-transparent hover:bg-red-500/10 text-red-500 font-semibold py-1 px-4 border border-red-500 rounded-xl transition-all cursor-pointer"
                >
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        show={!!pendingDelete}
        title="Delete form?"
        message={
          pendingDelete
            ? `"${pendingDelete.name}" and all of its ${pendingDelete.submissionsCount || 0} submissions will be permanently removed.`
            : ""
        }
        confirmText="Delete"
        variant="danger"
        onConfirm={performDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
