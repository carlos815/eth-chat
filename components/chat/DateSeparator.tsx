interface DateSeparatorProps {
    date: Date
}

const DateSeparator = ({ date }: DateSeparatorProps) => {
    return <div>{date.toDateString()}</div>
}

export default DateSeparator;