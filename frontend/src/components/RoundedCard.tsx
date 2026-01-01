interface RoundedCardProps {
    children: React.ReactNode
}

export default function RoundedCard({children}: RoundedCardProps) {
    return <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        {children}
    </div>
}
