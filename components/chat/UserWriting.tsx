
import Image from "next/image";

interface UserWritingProps {
    name: string
}

const UserWriting = ({ name }: UserWritingProps) => {


    return <div className="flex gap-[10px] text-[14px] self-end mr-8 mb-2 ">
        <Image src={"/message.svg"} height="14" width="16" />
        <span>
            {name.slice(0, 10)} is writing...
        </span>

    </div>
}

export default UserWriting;