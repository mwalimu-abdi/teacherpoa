import MasterSchemeBuilder from "./MasterSchemeBuilder"

export default function AdminMasterSchemesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Master Schemes</h1>
      <p className="text-gray-600 mb-6">
        Create and manage editable master schemes of work.
      </p>

      <MasterSchemeBuilder />
    </div>
  )
}