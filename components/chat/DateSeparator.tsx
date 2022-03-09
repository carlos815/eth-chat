interface DateSeparatorProps {
    date: Date
}

const DateSeparator = ({ date }: DateSeparatorProps) => {

    const actualDate = (): string => {
        const now = new Date()
        let yesterday = new Date()
        yesterday.setDate(now.getDate() - 1)
        if (date.toDateString() === now.toDateString()) {
            return "Today"
        } if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday"
        } else {
            return date.toDateString().slice(4, 10)
        }
    }

    return <div className="text-center flex items-center gap-x-10 
    before:h-[0.5px] before:w-full before:bg-neutral-600
        after:h-[0.5px] after:w-full after:bg-neutral-600

    "><p className="w-36">
            {actualDate()}</p></div>
}

export default DateSeparator;