"use client"

const resources = [
  {
    role: "Frontend Developer",
    count: 3,
    allocation: [
      { phase: 1, percentage: 100 },
      { phase: 2, percentage: 80 },
      { phase: 3, percentage: 60 },
      { phase: 4, percentage: 40 },
    ],
  },
  {
    role: "Backend Developer",
    count: 4,
    allocation: [
      { phase: 1, percentage: 80 },
      { phase: 2, percentage: 100 },
      { phase: 3, percentage: 80 },
      { phase: 4, percentage: 60 },
    ],
  },
  {
    role: "DevOps Engineer",
    count: 2,
    allocation: [
      { phase: 1, percentage: 60 },
      { phase: 2, percentage: 40 },
      { phase: 3, percentage: 60 },
      { phase: 4, percentage: 100 },
    ],
  },
  {
    role: "QA Engineer",
    count: 2,
    allocation: [
      { phase: 1, percentage: 40 },
      { phase: 2, percentage: 60 },
      { phase: 3, percentage: 80 },
      { phase: 4, percentage: 100 },
    ],
  },
  {
    role: "UI/UX Designer",
    count: 2,
    allocation: [
      { phase: 1, percentage: 100 },
      { phase: 2, percentage: 80 },
      { phase: 3, percentage: 60 },
      { phase: 4, percentage: 20 },
    ],
  },
  {
    role: "Product Manager",
    count: 1,
    allocation: [
      { phase: 1, percentage: 100 },
      { phase: 2, percentage: 100 },
      { phase: 3, percentage: 100 },
      { phase: 4, percentage: 100 },
    ],
  },
  {
    role: "Security Specialist",
    count: 1,
    allocation: [
      { phase: 1, percentage: 100 },
      { phase: 2, percentage: 60 },
      { phase: 3, percentage: 40 },
      { phase: 4, percentage: 100 },
    ],
  },
  {
    role: "Data Engineer",
    count: 1,
    allocation: [
      { phase: 1, percentage: 20 },
      { phase: 2, percentage: 40 },
      { phase: 3, percentage: 100 },
      { phase: 4, percentage: 60 },
    ],
  },
]

export default function ResourceAllocation() {
  return (
    <div className="w-full bg-white p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Resource Allocation Plan</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Count</th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Phase 1<br />
                (Weeks 1-8)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Phase 2<br />
                (Weeks 9-16)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Phase 3<br />
                (Weeks 17-24)
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Phase 4<br />
                (Weeks 25-30)
              </th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{resource.role}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{resource.count}</td>
                {resource.allocation.map((alloc, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                        <div
                          className="h-4 rounded-full"
                          style={{
                            width: `${alloc.percentage}%`,
                            backgroundColor:
                              alloc.percentage >= 80
                                ? "#4caf50"
                                : alloc.percentage >= 60
                                  ? "#8bc34a"
                                  : alloc.percentage >= 40
                                    ? "#ffeb3b"
                                    : alloc.percentage >= 20
                                      ? "#ff9800"
                                      : "#f44336",
                          }}
                        ></div>
                      </div>
                      <span className="text-sm">{alloc.percentage}%</span>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Resource Requirements Summary</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Total Team Size:</strong> {resources.reduce((acc, r) => acc + r.count, 0)} members
          </li>
          <li>
            <strong>Peak Resource Utilization:</strong> Phase 2 (Weeks 9-16)
          </li>
          <li>
            <strong>Additional Specialists:</strong> May require temporary specialists for compliance certification and
            security auditing
          </li>
          <li>
            <strong>Contingency:</strong> 20% buffer recommended for unexpected challenges
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Key Resource Considerations</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Security Expertise:</strong> Critical during Phase 1 and Phase 4
          </li>
          <li>
            <strong>Frontend Development:</strong> Heaviest in early phases, tapering as platform matures
          </li>
          <li>
            <strong>Backend Development:</strong> Consistent need throughout with peak in Phase 2
          </li>
          <li>
            <strong>QA Resources:</strong> Increasing allocation as features are completed
          </li>
          <li>
            <strong>DevOps:</strong> Critical during final phase for performance optimization and scalability
          </li>
        </ul>
      </div>
    </div>
  )
}
