interface Props {
    children: React.ReactNode
}

export function Container(props: Props) {
    const { children } = props;
    return (
        <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-4 sm:px-6">
            {children}
        </div>
    )
}