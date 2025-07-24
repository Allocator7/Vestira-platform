"use client"

import React from "react"

const phases = [
  {
    name: "Phase 1: Core Security & Foundation",
    duration: "Weeks 1-8",
    tasks: [
      { name: "Authentication & Security Implementation", duration: "4 weeks", dependencies: [] },
      {
        name: "Document Management & Data Rooms",
        duration: "4 weeks",
        dependencies: ["Authentication & Security Implementation"],
      },
      { name: "Core UI Components", duration: "3 weeks", dependencies: [] },
      { name: "Base API Infrastructure", duration: "2 weeks", dependencies: [] },
    ],
  },
  {
    name: "Phase 2: Advanced Features & Collaboration",
    duration: "Weeks 9-16",
    tasks: [
      {
        name: "Due Diligence Questionnaires (DDQs)",
        duration: "4 weeks",
        dependencies: ["Document Management & Data Rooms"],
      },
      {
        name: "Communication & Collaboration",
        duration: "3 weeks",
        dependencies: ["Authentication & Security Implementation"],
      },
      { name: "Advanced UI Components", duration: "3 weeks", dependencies: ["Core UI Components"] },
      { name: "Integration Framework", duration: "2 weeks", dependencies: ["Base API Infrastructure"] },
    ],
  },
  {
    name: "Phase 3: Analytics & Enterprise Features",
    duration: "Weeks 17-24",
    tasks: [
      {
        name: "Data & Analytics Platform",
        duration: "4 weeks",
        dependencies: ["Document Management & Data Rooms", "Due Diligence Questionnaires (DDQs)"],
      },
      {
        name: "Administration & Governance",
        duration: "3 weeks",
        dependencies: ["Authentication & Security Implementation"],
      },
      { name: "Enterprise Integration", duration: "3 weeks", dependencies: ["Integration Framework"] },
      { name: "Advanced Collaboration Features", duration: "2 weeks", dependencies: ["Communication & Collaboration"] },
    ],
  },
  {
    name: "Phase 4: Performance, Scalability & Compliance",
    duration: "Weeks 25-30",
    tasks: [
      { name: "Performance Optimization", duration: "3 weeks", dependencies: ["Data & Analytics Platform"] },
      { name: "Scalability Architecture", duration: "3 weeks", dependencies: ["Performance Optimization"] },
      { name: "Legal & Compliance Framework", duration: "4 weeks", dependencies: ["Administration & Governance"] },
      {
        name: "Final Testing & Certification",
        duration: "2 weeks",
        dependencies: ["Performance Optimization", "Scalability Architecture", "Legal & Compliance Framework"],
      },
    ],
  },
]

export default function ImplementationTimeline() {
  const totalWeeks = 30
  const weekWidth = 30
  const headerHeight = 50
  const rowHeight = 40
  const barHeight = 30
  const width = totalWeeks * weekWidth + 300
  const height = phases.reduce((acc, phase) => acc + phase.tasks.length, 0) * rowHeight + headerHeight + 100

  let currentY = headerHeight + 50

  return (
    <div className="w-full overflow-auto bg-white p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Vestira 3.0 Implementation Timeline</h2>
      <svg width={width} height={height}>
        {/* Header - Week numbers */}
        <g>
          <rect x={300} y={20} width={totalWeeks * weekWidth} height={headerHeight} fill="#f5f5f5" stroke="#ddd" />
          {Array.from({ length: totalWeeks + 1 }).map((_, i) => (
            <React.Fragment key={`week-${i}`}>
              <line
                x1={300 + i * weekWidth}
                y1={20}
                x2={300 + i * weekWidth}
                y2={height}
                stroke="#ddd"
                strokeWidth="1"
              />
              {i < totalWeeks && (
                <text x={300 + i * weekWidth + weekWidth / 2} y={45} textAnchor="middle" fontSize="12">
                  Week {i + 1}
                </text>
              )}
            </React.Fragment>
          ))}
        </g>

        {/* Phases and Tasks */}
        {phases.map((phase, phaseIndex) => {
          const phaseY = currentY
          const phaseTasks = phase.tasks.map((task, taskIndex) => {
            const taskY = currentY
            currentY += rowHeight

            // Parse week numbers from phase duration
            const phaseWeeks = phase.duration.match(/Weeks (\d+)-(\d+)/)
            const startWeek = Number.parseInt(phaseWeeks[1]) - 1

            // Calculate task duration in weeks
            const taskDuration = Number.parseInt(task.duration.match(/(\d+) weeks?/)[1])

            // Calculate task position based on dependencies
            let taskStartWeek = startWeek
            if (task.dependencies.length > 0) {
              // Find the latest end week of all dependencies
              const dependencyEndWeeks = task.dependencies.map((depName) => {
                // Find the dependency task
                for (let p = 0; p <= phaseIndex; p++) {
                  const depTask = phases[p].tasks.find((t) => t.name === depName)
                  if (depTask) {
                    const depPhaseWeeks = phases[p].duration.match(/Weeks (\d+)-(\d+)/)
                    const depStartWeek = Number.parseInt(depPhaseWeeks[1]) - 1
                    const depDuration = Number.parseInt(depTask.duration.match(/(\d+) weeks?/)[1])
                    return depStartWeek + depDuration
                  }
                }
                return startWeek
              })
              taskStartWeek = Math.max(...dependencyEndWeeks)
            }

            return {
              ...task,
              y: taskY,
              startWeek: taskStartWeek,
              endWeek: taskStartWeek + taskDuration,
            }
          })

          return (
            <g key={`phase-${phaseIndex}`}>
              {/* Phase label */}
              <text x={10} y={phaseY - 10} fontSize="14" fontWeight="bold">
                {phase.name}
              </text>
              <text x={10} y={phaseY + 10} fontSize="12" fill="#666">
                {phase.duration}
              </text>

              {/* Tasks */}
              {phaseTasks.map((task, taskIndex) => (
                <g key={`task-${phaseIndex}-${taskIndex}`}>
                  <text x={30} y={task.y + rowHeight / 2} fontSize="12" dominantBaseline="middle">
                    {task.name}
                  </text>

                  {/* Task bar */}
                  <rect
                    x={300 + task.startWeek * weekWidth}
                    y={task.y + (rowHeight - barHeight) / 2}
                    width={(task.endWeek - task.startWeek) * weekWidth}
                    height={barHeight}
                    rx={4}
                    ry={4}
                    fill={`hsl(${phaseIndex * 60 + taskIndex * 15}, 70%, 80%)`}
                    stroke={`hsl(${phaseIndex * 60 + taskIndex * 15}, 70%, 60%)`}
                  />

                  <text
                    x={300 + task.startWeek * weekWidth + ((task.endWeek - task.startWeek) * weekWidth) / 2}
                    y={task.y + rowHeight / 2}
                    fontSize="12"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {task.duration}
                  </text>

                  {/* Dependencies */}
                  {task.dependencies.map((depName, depIndex) => {
                    // Find the dependency task
                    for (let p = 0; p <= phaseIndex; p++) {
                      const depTask = phases[p].tasks.find((t) => t.name === depName)
                      if (depTask) {
                        // Find the rendered task with position info
                        const renderedTasks =
                          p === phaseIndex
                            ? phaseTasks.slice(0, taskIndex)
                            : phases[p].tasks.map((t, i) => ({
                                ...t,
                                y:
                                  headerHeight +
                                  50 +
                                  phases.slice(0, p).reduce((acc, phase) => acc + phase.tasks.length, 0) * rowHeight +
                                  i * rowHeight,
                              }))

                        const renderedDepTask = renderedTasks.find((t) => t.name === depName)

                        if (renderedDepTask) {
                          const depPhaseWeeks = phases[p].duration.match(/Weeks (\d+)-(\d+)/)
                          const depStartWeek = Number.parseInt(depPhaseWeeks[1]) - 1
                          const depDuration = Number.parseInt(depTask.duration.match(/(\d+) weeks?/)[1])
                          const depEndWeek = depStartWeek + depDuration

                          return (
                            <path
                              key={`dep-${phaseIndex}-${taskIndex}-${depIndex}`}
                              d={`M ${300 + depEndWeek * weekWidth} ${renderedDepTask.y + rowHeight / 2} 
                                  C ${300 + (depEndWeek * weekWidth) + 20} ${renderedDepTask.y + rowHeight / 2},
                                    ${300 + (task.startWeek * weekWidth) - 20} ${task.y + rowHeight / 2},
                                    ${300 + task.startWeek * weekWidth} ${task.y + rowHeight / 2}`}
                              fill="none"
                              stroke="#999"
                              strokeWidth="1"
                              strokeDasharray="3,3"
                              markerEnd="url(#arrowhead)"
                            />
                          )
                        }
                      }
                    }
                    return null
                  })}
                </g>
              ))}
            </g>
          )
        })}

        {/* Arrow marker definition */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#999" />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
