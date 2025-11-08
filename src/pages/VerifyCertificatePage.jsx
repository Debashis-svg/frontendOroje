import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/common/Spinner";
import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function VerifyCertificatePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      api
        .get(`/verify/${id}`)
        .then((res) => setCertificate(res.data.certificate))
        .catch((err) => {
          setError(err.response?.data?.message || "Invalid certificate ID.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6">
        <div className="bg-white border border-red-200 rounded-xl p-10 shadow-md max-w-lg">
          <XCircleIcon className="h-20 w-20 text-red-500 mb-4 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Verification Failed</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6">
      <div className="bg-white border border-green-200 rounded-xl shadow-md p-10 max-w-lg">
        <CheckBadgeIcon className="h-20 w-20 text-green-500 mb-4 mx-auto" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Certificate Verified ✅</h1>
        <p className="text-gray-600">This is to certify that</p>
        <p className="text-2xl font-semibold text-blue-600 my-3">{certificate.teamName}</p>
        <p className="text-gray-600">was awarded with</p>
        <p className="text-xl font-bold text-gray-800 mt-1">{certificate.achievement}</p>

        <div className="mt-6 text-sm text-gray-500 border-t pt-4">
          <p>Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
          <p>Verification ID: {certificate.verificationId}</p>
        </div>
      </div>
    </div>
  );
}
