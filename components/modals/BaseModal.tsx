interface ModalProps {
    title?: string,
    content?: string,
    children?: any,
    important?: boolean,
    className?: string,
    open?: boolean
}
const BaseModal = ({ title, content, children, important, className, open }: ModalProps) => {

    return <dialog className={`${className}  rounded-[17px] z-20  bg-neutral-900   p-[3px]  ${important && "bg-gradient-to-r from-gradient-start  to-gradient-end"}`} open={open}>



        <div className={`text-white   rounded-2xl  p-6 bg-neutral-900 flex flex-col gap-4 w-[571px] text-center `}>


            <h1 className="text-4xl font-display">{title}</h1>
            <p className="">{content}</p>

            {children}

        </div>
    </dialog >
}

export default BaseModal