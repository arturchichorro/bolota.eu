import { SubscriberForm } from "./subscriber-form"

const SubscribeSection = () => {
  return (
    <div className="bg-popover py-4 px-3 md:px-6 border-2 border-border rounded-lg w-full max-w-[70%] sm:max-w-md flex flex-col justify-center gap-3">
        <div className="text-balance text-center mx-auto max-w-xs md:max-w-sm">
            <span className="text-sm sm:text-base text-accent">If you&apos;d like to get updates when I write something new, enter your email below!</span>
        </div>
        <SubscriberForm />
    </div>
  )
}

export default SubscribeSection