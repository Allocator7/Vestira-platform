export const Rectangle = ({ x, y, width, height, label, color = "#e6e6e6" }) => (
  <g>
    <rect x={x} y={y} width={width} height={height} fill={color} stroke="#333" strokeWidth="1" rx="5" ry="5" />
    <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fontSize="14">
      {label}
    </text>
  </g>
)

export const Circle = ({ x, y, radius = 40, label, color = "#e6e6e6" }) => (
  <g>
    <circle cx={x} cy={y} r={radius} fill={color} stroke="#333" strokeWidth="1" />
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="12">
      {label}
    </text>
  </g>
)

export const Line = ({ x1, y1, x2, y2, label }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth="1" />
    {label && (
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2} textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="#333">
        {label}
      </text>
    )}
  </g>
)

export const DiamondShape = ({ x, y, width = 80, height = 80, label, color = "#e6e6e6" }) => {
  const points = `${x},${y + height / 2} ${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height}`
  return (
    <g>
      <polygon points={points} fill={color} stroke="#333" strokeWidth="1" />
      <text x={x + width / 2} y={y + height / 2} textAnchor="middle" dominantBaseline="middle" fontSize="12">
        {label}
      </text>
    </g>
  )
}

export const Database = ({ x, y, label, color = "#b3e5fc" }) => (
  <g>
    <ellipse cx={x} cy={y - 15} rx={40} ry={15} fill={color} stroke="#333" strokeWidth="1" />
    <rect x={x - 40} y={y - 15} width={80} height={30} fill={color} stroke="#333" strokeWidth="1" />
    <ellipse cx={x} cy={y + 15} rx={40} ry={15} fill={color} stroke="#333" strokeWidth="1" />
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="12">
      {label}
    </text>
  </g>
)

export const Cloud = ({ x, y, label, color = "#e1f5fe" }) => (
  <g>
    <path
      d="M 25,60 
             a 20,20 1 0,1 0,-40 
             h 50 
             a 20,20 1 0,1 0,-40 
             h 50 
             a 20,20 1 0,1 0,40 
             a 20,20 1 0,1 0,40 
             z"
      fill={color}
      stroke="#333"
      strokeWidth="1"
      transform={`translate(${x - 75}, ${y - 40})`}
    />
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="12">
      {label}
    </text>
  </g>
)

export const Server = ({ x, y, label, color = "#e8eaf6" }) => (
  <g>
    <rect x={x - 30} y={y - 25} width={60} height={50} fill={color} stroke="#333" strokeWidth="1" rx="2" ry="2" />
    <line x1={x - 30} y1={y - 15} x2={x + 30} y2={y - 15} stroke="#333" strokeWidth="1" />
    <line x1={x - 30} y1={y - 5} x2={x + 30} y2={y - 5} stroke="#333" strokeWidth="1" />
    <line x1={x - 30} y1={y + 5} x2={x + 30} y2={y + 5} stroke="#333" strokeWidth="1" />
    <text x={x} y={y + 35} textAnchor="middle" dominantBaseline="middle" fontSize="12">
      {label}
    </text>
  </g>
)

export const MobileDevice = ({ x, y, label, color = "#f5f5f5" }) => (
  <g>
    <rect x={x - 20} y={y - 30} width={40} height={60} fill={color} stroke="#333" strokeWidth="1" rx="5" ry="5" />
    <rect x={x - 10} y={y - 20} width={20} height={30} fill="#333" stroke="none" />
    <circle cx={x} cy={y + 20} r={5} fill="#333" stroke="none" />
    <text x={x} y={y + 40} textAnchor="middle" dominantBaseline="middle" fontSize="12">
      {label}
    </text>
  </g>
)

export const Desktop = ({ x, y, label, color = "#f5f5f5" }) => (
  <g>
    <rect x={x - 40} y={y - 30} width={80} height={50} fill={color} stroke="#333" strokeWidth="1" rx="2" ry="2" />
    <rect x={x - 35} y={y - 25} width={70} height={40} fill="#333" stroke="none" />
    <rect x={x - 25} y={y + 20} width={50} height={10} fill={color} stroke="#333" strokeWidth="1" />
    <rect x={x - 15} y={y + 30} width={30} height={5} fill={color} stroke="#333" strokeWidth="1" />
    <text x={x} y={y + 45} textAnchor="middle" dominantBaseline="middle" fontSize="12">
      {label}
    </text>
  </g>
)

export const Lock = ({ x, y, label, color = "#ffebee" }) => (
  <g>
    <rect x={x - 15} y={y - 5} width={30} height={25} fill={color} stroke="#333" strokeWidth="1" rx="2" ry="2" />
    <path
      d="M -10,-5 V -15 a 10,10 0 0,1 20,0 V -5"
      fill="none"
      stroke="#333"
      strokeWidth="2"
      transform={`translate(${x}, ${y})`}
    />
    <circle cx={x} cy={y + 7} r={5} fill="#333" stroke="none" />
    <text x={x} y={y + 30} textAnchor="middle" dominantBaseline="middle" fontSize="12">
      {label}
    </text>
  </g>
)

export const Shield = ({ x, y, label, color = "#e8f5e9" }) => (
  <g>
    <path
      d="M 0,-25 
             C 20,-25 20,-25 20,-25 
             C 20,-10 20,0 0,25 
             C -20,0 -20,-10 -20,-25 
             C -20,-25 -20,-25 0,-25 z"
      fill={color}
      stroke="#333"
      strokeWidth="1"
      transform={`translate(${x}, ${y})`}
    />
    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="12">
      {label}
    </text>
  </g>
)
