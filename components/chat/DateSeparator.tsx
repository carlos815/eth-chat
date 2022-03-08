interface DateSeparatorProps {
    date: Date
}

const DateSeparator = ({ date }: DateSeparatorProps) => {
    return <div className="text-center">{date.toDateString()}</div>
}

export default DateSeparator;