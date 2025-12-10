interface RoundedCardProps {
    children: React.ReactNode
}

export default function RoundedCard({children}: RoundedCardProps) {
    return <div className="bg-white rounded-xl p-6 mb-4 shadow-sm">
        {children}
    </div>
}
