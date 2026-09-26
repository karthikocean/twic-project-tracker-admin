"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileBadge2,
  Building2,
  ShieldCheck,
  Users,
  Coins,
  GraduationCap,
  HardHat,
  Briefcase,
  Paperclip,
  CheckSquare,
  Plus,
  Trash2,
  Save,
  Send,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { FormSection } from "@/components/common/FormSection";
import { FileUpload } from "@/components/common/FileUpload";
import { savePreQualification } from "@/services/vendorService";
import { PreQualificationData } from "@/types";

export default function NewPreQualificationFormPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Section 1: Company Information
  const [companyName, setCompanyName] = useState("");
  const [registeredAddress, setRegisteredAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  // Section 2: Statutory Information
  const [panNumber, setPanNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [msmeCertificateNumber, setMsmeCertificateNumber] = useState("");
  const [rocCertificateNumber, setRocCertificateNumber] = useState("");

  // Section 3: Contact Persons (Dynamic)
  const [contactPersons, setContactPersons] = useState([
    {
      id: "cp-1",
      name: "",
      mobile: "",
      email: "",
      designation: "",
    },
  ]);

  // Section 4: Turnover
  const [turnovers, setTurnovers] = useState([
    { financialYear: "2025-2026", turnoverAmount: 0, isAudited: true },
    { financialYear: "2024-2025", turnoverAmount: 0, isAudited: true },
    { financialYear: "2023-2024", turnoverAmount: 0, isAudited: true },
  ]);

  // Section 5 & 6: Technical Personnel & Employees
  const [numberOfTechnicalPersons, setNumberOfTechnicalPersons] = useState(15);
  const [technicalPersonnel, setTechnicalPersonnel] = useState([
    {
      id: "tp-1",
      name: "",
      qualification: "",
      experienceYears: 10,
      specialization: "",
    },
  ]);
  const [technicalEmployeesCount, setTechnicalEmployeesCount] = useState(40);
  const [nonTechnicalEmployeesCount, setNonTechnicalEmployeesCount] = useState(15);

  // Section 7: Past Project Experience (Water & Wastewater Industries)
  const [pastProjects, setPastProjects] = useState([
    {
      id: "pe-1",
      clientName: "",
      projectName: "",
      projectDescription: "",
      projectValue: 0,
      completionStatus: "Completed" as const,
      completionDate: "2024-03-31",
      completionTestimonial: "",
      workOrderNumber: "",
    },
  ]);

  // Section 9: Declaration
  const [contractorName, setContractorName] = useState("");
  const [authorizedSignatory, setAuthorizedSignatory] = useState("");
  const [designation, setDesignation] = useState("Managing Director");
  const [placeOfDeclaration, setPlaceOfDeclaration] = useState("Chennai");
  const [dateOfDeclaration, setDateOfDeclaration] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [declarationAgreed, setDeclarationAgreed] = useState(false);

  // Handlers for dynamic rows
  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      {
        id: `cp-${Date.now()}`,
        name: "",
        mobile: "",
        email: "",
        designation: "",
      },
    ]);
  };

  const removeContactPerson = (id: string) => {
    if (contactPersons.length > 1) {
      setContactPersons(contactPersons.filter((c) => c.id !== id));
    }
  };

  const addTechnicalPerson = () => {
    setTechnicalPersonnel([
      ...technicalPersonnel,
      {
        id: `tp-${Date.now()}`,
        name: "",
        qualification: "",
        experienceYears: 5,
        specialization: "",
      },
    ]);
  };

  const removeTechnicalPerson = (id: string) => {
    if (technicalPersonnel.length > 1) {
      setTechnicalPersonnel(technicalPersonnel.filter((t) => t.id !== id));
    }
  };

  const addPastProject = () => {
    setPastProjects([
      ...pastProjects,
      {
        id: `pe-${Date.now()}`,
        clientName: "",
        projectName: "",
        projectDescription: "",
        projectValue: 0,
        completionStatus: "Completed",
        completionDate: "",
        completionTestimonial: "",
        workOrderNumber: "",
      },
    ]);
  };

  const removePastProject = (id: string) => {
    if (pastProjects.length > 1) {
      setPastProjects(pastProjects.filter((p) => p.id !== id));
    }
  };

  const handleSave = async (status: "Draft" | "Submitted") => {
    if (status === "Submitted" && !companyName) {
      alert("Please enter the Company Name in Section 1 before submitting.");
      setActiveStep(1);
      return;
    }
    if (status === "Submitted" && !declarationAgreed) {
      alert("Please accept the declaration terms in Section 9.");
      setActiveStep(9);
      return;
    }

    setIsSubmitting(true);
    try {
      const vendorId = `vn-${Date.now()}`;
      await savePreQualification({
        vendorId,
        status,
        companyName: companyName || "Draft Vendor Entity",
        registeredAddress,
        phone,
        email,
        website,
        panNumber: panNumber || "ABCDE1234F",
        gstNumber: gstNumber || "33ABCDE1234F1Z1",
        msmeCertificateNumber,
        rocCertificateNumber,
        contactPersons,
        turnovers,
        numberOfTechnicalPersons,
        technicalPersonnel,
        technicalEmployeesCount,
        nonTechnicalEmployeesCount,
        pastProjects,
        enclosures: [
          {
            id: "enc-1",
            title: "Audited Balance Sheets for last three years",
            status: "Uploaded",
          },
          {
            id: "enc-2",
            title: "Project Completion Reports & Testimonials",
            status: "Uploaded",
          },
          { id: "enc-3", title: "Copies of Work Orders", status: "Uploaded" },
          {
            id: "enc-4",
            title: "MSME / ROC / PAN / GST Documents",
            status: "Uploaded",
          },
        ],
        contractorName: contractorName || companyName,
        authorizedSignatory: authorizedSignatory || "Authorized Officer",
        designation,
        dateOfDeclaration,
        placeOfDeclaration,
        signatureUploaded: true,
        officeSealUploaded: true,
      });

      setShowToast(true);
      setTimeout(() => {
        router.push("/pre-qualification");
      }, 1200);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  const stepList = [
    { num: 1, label: "Company Info" },
    { num: 2, label: "Statutory" },
    { num: 3, label: "Contacts" },
    { num: 4, label: "Turnover" },
    { num: 5, label: "Tech Persons" },
    { num: 6, label: "Employees" },
    { num: 7, label: "Water Projects" },
    { num: 8, label: "Enclosures" },
    { num: 9, label: "Declaration" },
  ];

  return (
    <AppLayout title="Actual Vendor Pre-Qualification Form">
      <PageHeader
        title="PRE-QUALIFICATION FORM"
        subtitle="Please fill up questionnaires and attach relevant documents as mentioned in the form. (Water & Wastewater Industries Empanelment)"
        breadcrumbs={[
          { label: "Vendors", href: "/vendors" },
          { label: "Pre-Qualification", href: "/pre-qualification" },
          { label: "New Form" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave("Draft")}
              disabled={isSubmitting}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave("Submitted")}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Submitting..." : "Submit Pre-Qualification"}</span>
            </button>
          </div>
        }
      />

      {showToast && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Pre-qualification application recorded successfully in mock state!</span>
        </div>
      )}

      {/* 9-Step Navigation Header */}
      <div className="mb-6 bg-white rounded-lg border border-slate-200 p-2 shadow-xs overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-max">
          {stepList.map((step) => {
            const isActive = activeStep === step.num;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => setActiveStep(step.num)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {step.num}
                </span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 w-full">
        {/* SECTION 1: COMPANY INFORMATION */}
        {activeStep === 1 && (
          <FormSection
            title="SECTION 1: COMPANY INFORMATION"
            description="Official corporate registration details and contact coordinates."
            stepNumber={1}
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Name of the Company *
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. VA Tech Wabag Limited"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registered Address *
              </label>
              <textarea
                rows={2}
                value={registeredAddress}
                onChange={(e) => setRegisteredAddress(e.target.value)}
                placeholder="Complete registered head office address with pincode..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Numbers *
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 44 6123 2323"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tenders@company.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.company.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
                />
              </div>
            </div>
          </FormSection>
        )}

        {/* SECTION 2: STATUTORY INFORMATION */}
        {activeStep === 2 && (
          <FormSection
            title="SECTION 2: STATUTORY INFORMATION"
            description="Permanent Account Number, GSTIN, MSME, and MCA Incorporation details."
            stepNumber={2}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PAN Number *
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="AAACV1234F"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GST Number *
                </label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  placeholder="33AAACV1234F1Z5"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  MSME Certificate Number (Optional)
                </label>
                <input
                  type="text"
                  value={msmeCertificateNumber}
                  onChange={(e) => setMsmeCertificateNumber(e.target.value)}
                  placeholder="UDYAM-TN-02-0045129"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ROC / Certificate of Incorporation *
                </label>
                <input
                  type="text"
                  value={rocCertificateNumber}
                  onChange={(e) => setRocCertificateNumber(e.target.value)}
                  placeholder="L45205TN1995PLC030231"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 font-mono"
                />
              </div>
            </div>
          </FormSection>
        )}

        {/* SECTION 3: CONTACT PERSONS (Dynamic) */}
        {activeStep === 3 && (
          <FormSection
            title="SECTION 3: CONTACT PERSONS"
            description="Dynamic list of authorized commercial and technical contact officers."
            stepNumber={3}
            badge={`${contactPersons.length} Contacts Added`}
          >
            <div className="space-y-3">
              {contactPersons.map((contact, index) => (
                <div
                  key={contact.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Contact Person #{index + 1}
                    </span>
                    {contactPersons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContactPerson(contact.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => {
                          const updated = [...contactPersons];
                          updated[index].name = e.target.value;
                          setContactPersons(updated);
                        }}
                        placeholder="Mr. Rajiv Krishnan"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={contact.designation}
                        onChange={(e) => {
                          const updated = [...contactPersons];
                          updated[index].designation = e.target.value;
                          setContactPersons(updated);
                        }}
                        placeholder="Vice President"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="text"
                        value={contact.mobile}
                        onChange={(e) => {
                          const updated = [...contactPersons];
                          updated[index].mobile = e.target.value;
                          setContactPersons(updated);
                        }}
                        placeholder="+91 98401 23456"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Email ID *
                      </label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => {
                          const updated = [...contactPersons];
                          updated[index].email = e.target.value;
                          setContactPersons(updated);
                        }}
                        placeholder="rajiv.k@company.com"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addContactPerson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Contact Person</span>
              </button>
            </div>
          </FormSection>
        )}

        {/* SECTION 4: TURNOVER */}
        {activeStep === 4 && (
          <FormSection
            title="SECTION 4: ANNUAL TURNOVER (LAST THREE YEARS)"
            description="Audited financial figures for 2025-2026, 2024-2025, and 2023-2024."
            stepNumber={4}
          >
            <div className="space-y-4">
              {turnovers.map((t, idx) => (
                <div
                  key={t.financialYear}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="w-40 font-bold text-slate-900 text-xs">
                    Financial Year {t.financialYear}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <label className="text-xs text-slate-500 whitespace-nowrap">
                      Turnover (₹):
                    </label>
                    <input
                      type="number"
                      value={t.turnoverAmount}
                      onChange={(e) => {
                        const updated = [...turnovers];
                        updated[idx].turnoverAmount = Number(e.target.value);
                        setTurnovers(updated);
                      }}
                      placeholder="e.g. 2980000000"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded font-mono text-slate-800"
                    />
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckSquare className="h-3.5 w-3.5" /> Audited Statement
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <FileUpload
                  label="Upload Audited Balance Sheets (3 Years Combined PDF)"
                  description="Chartered Accountant signed and attested balance sheet pack"
                />
              </div>
            </div>
          </FormSection>
        )}

        {/* SECTION 5: TECHNICAL PERSONNEL */}
        {activeStep === 5 && (
          <FormSection
            title="SECTION 5: TECHNICAL PERSONNEL"
            description="Qualifications and track record of key project engineers and specialists."
            stepNumber={5}
          >
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Number of Technical Persons on Rolls *
              </label>
              <input
                type="number"
                value={numberOfTechnicalPersons}
                onChange={(e) => setNumberOfTechnicalPersons(Number(e.target.value))}
                className="w-48 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
              />
            </div>

            <div className="space-y-3">
              {technicalPersonnel.map((person, index) => (
                <div
                  key={person.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Key Technical Lead #{index + 1}
                    </span>
                    {technicalPersonnel.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTechnicalPerson(person.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={person.name}
                        onChange={(e) => {
                          const updated = [...technicalPersonnel];
                          updated[index].name = e.target.value;
                          setTechnicalPersonnel(updated);
                        }}
                        placeholder="Dr. K. Swaminathan"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Qualification *
                      </label>
                      <input
                        type="text"
                        value={person.qualification}
                        onChange={(e) => {
                          const updated = [...technicalPersonnel];
                          updated[index].qualification = e.target.value;
                          setTechnicalPersonnel(updated);
                        }}
                        placeholder="Ph.D. Environmental Engg"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Experience (Years) *
                      </label>
                      <input
                        type="number"
                        value={person.experienceYears}
                        onChange={(e) => {
                          const updated = [...technicalPersonnel];
                          updated[index].experienceYears = Number(e.target.value);
                          setTechnicalPersonnel(updated);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={person.specialization}
                        onChange={(e) => {
                          const updated = [...technicalPersonnel];
                          updated[index].specialization = e.target.value;
                          setTechnicalPersonnel(updated);
                        }}
                        placeholder="Desalination & RO"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addTechnicalPerson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Technical Person</span>
              </button>
            </div>
          </FormSection>
        )}

        {/* SECTION 6: EMPLOYEE DETAILS */}
        {activeStep === 6 && (
          <FormSection
            title="SECTION 6: EMPLOYEE DETAILS"
            description="Overall strength of technical and administrative workforce."
            stepNumber={6}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Technical Employees (Engineers, Draftsmen, Chemists, Supervisors) *
                </label>
                <input
                  type="number"
                  value={technicalEmployeesCount}
                  onChange={(e) => setTechnicalEmployeesCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md font-bold text-slate-900"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Non-Technical Employees (Commercial, Finance, HR, Admin) *
                </label>
                <input
                  type="number"
                  value={nonTechnicalEmployeesCount}
                  onChange={(e) => setNonTechnicalEmployeesCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md font-bold text-slate-900"
                />
              </div>
            </div>
          </FormSection>
        )}

        {/* SECTION 7: PAST CLIENTS / PROJECT EXPERIENCE (For Water & Wastewater) */}
        {activeStep === 7 && (
          <FormSection
            title="SECTION 7: PAST CLIENTS / PROJECT EXPERIENCE"
            description="Confirmed client requirement: Water & Wastewater Industries track record."
            stepNumber={7}
            badge="Water & Wastewater Focus"
          >
            <div className="space-y-4">
              {pastProjects.map((proj, index) => (
                <div
                  key={proj.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      Water & Wastewater Project #{index + 1}
                    </span>
                    {pastProjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePastProject(proj.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={proj.clientName}
                        onChange={(e) => {
                          const updated = [...pastProjects];
                          updated[index].clientName = e.target.value;
                          setPastProjects(updated);
                        }}
                        placeholder="e.g. CMWSSB Chennai / TWAD Board"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        value={proj.projectName}
                        onChange={(e) => {
                          const updated = [...pastProjects];
                          updated[index].projectName = e.target.value;
                          setPastProjects(updated);
                        }}
                        placeholder="45 MLD Tertiary Treatment Reverse Osmosis (TTRO)"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Project Description
                      </label>
                      <input
                        type="text"
                        value={proj.projectDescription}
                        onChange={(e) => {
                          const updated = [...pastProjects];
                          updated[index].projectDescription = e.target.value;
                          setPastProjects(updated);
                        }}
                        placeholder="Design, build, supply, installation and 15 years O&M of TTRO facility..."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Project Value (₹ INR) *
                      </label>
                      <input
                        type="number"
                        value={proj.projectValue}
                        onChange={(e) => {
                          const updated = [...pastProjects];
                          updated[index].projectValue = Number(e.target.value);
                          setPastProjects(updated);
                        }}
                        placeholder="3450000000"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Work Order Reference
                      </label>
                      <input
                        type="text"
                        value={proj.workOrderNumber}
                        onChange={(e) => {
                          const updated = [...pastProjects];
                          updated[index].workOrderNumber = e.target.value;
                          setPastProjects(updated);
                        }}
                        placeholder="CMWSSB/TTRO/2019/104"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Completion Testimonial / Performance Remark
                      </label>
                      <input
                        type="text"
                        value={proj.completionTestimonial}
                        onChange={(e) => {
                          const updated = [...pastProjects];
                          updated[index].completionTestimonial = e.target.value;
                          setPastProjects(updated);
                        }}
                        placeholder="Plant successfully commissioned on time with treated water meeting zero-discharge standards."
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addPastProject}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Water Project Experience</span>
              </button>
            </div>
          </FormSection>
        )}

        {/* SECTION 8: ENCLOSURES */}
        {activeStep === 8 && (
          <FormSection
            title="SECTION 8: ENCLOSURES & UPLOAD DOSSIER"
            description="Upload mandatory statutory annexures, completion certificates and work orders."
            stepNumber={8}
          >
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 text-xs block mb-1">
                  1. Audited Balance Sheets for last three years *
                </span>
                <FileUpload description="Upload CA audited balance sheets and P&L statement" />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 text-xs block mb-1">
                  2. Project Completion Reports & Performance Testimonials *
                </span>
                <FileUpload description="Upload client signed completion certificate copies" />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 text-xs block mb-1">
                  3. Copies of Work Orders / LOA *
                </span>
                <FileUpload description="Upload copies of original work orders" />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 text-xs block mb-1">
                  4. MSME / ROC / PAN / GST Documents *
                </span>
                <FileUpload description="Upload statutory registration certificates" />
              </div>
            </div>
          </FormSection>
        )}

        {/* SECTION 9: DECLARATION */}
        {activeStep === 9 && (
          <FormSection
            title="SECTION 9: DECLARATION & SIGNATURE"
            description="Legal undertaking by the authorized signatory on behalf of the contractor."
            stepNumber={9}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vendor / Contractor Legal Entity *
                </label>
                <input
                  type="text"
                  value={contractorName || companyName}
                  onChange={(e) => setContractorName(e.target.value)}
                  placeholder="VA Tech Wabag Limited"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorized Signatory Name *
                </label>
                <input
                  type="text"
                  value={authorizedSignatory}
                  onChange={(e) => setAuthorizedSignatory(e.target.value)}
                  placeholder="Mr. Rajiv Krishnan"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designation *
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Vice President / Director"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Place of Declaration
                </label>
                <input
                  type="text"
                  value={placeOfDeclaration}
                  onChange={(e) => setPlaceOfDeclaration(e.target.value)}
                  placeholder="Chennai"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold text-slate-800 block mb-1">
                  Digital / Scanned Signature Upload
                </span>
                <FileUpload description="Upload authorized signatory digital signature (PNG, JPG, PDF)" />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs font-semibold text-slate-800 block mb-1">
                  Official Company Seal Upload
                </span>
                <FileUpload description="Upload company rubber stamp / official seal impression" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declarationAgreed}
                  onChange={(e) => setDeclarationAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-0 h-4 w-4"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I hereby declare that all information furnished in Sections 1 through 9 and
                  annexed enclosures are true, correct, and complete to the best of my knowledge. We
                  meet all statutory and financial pre-qualification criteria for executing
                  Government water, wastewater, and infrastructure EPC works.
                </span>
              </label>
            </div>
          </FormSection>
        )}

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div>
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
              >
                ← Previous Section
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeStep < 9 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs"
              >
                Next Section →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave("Submitted")}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Submitting..." : "Submit Pre-Qualification Form"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
