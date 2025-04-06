import { SubscriberForm } from "./subscriber-form"

const SubscribeSection = () => {
  return (
    <div className="bg-popover py-4 border-2 border-border rounded-lg max-w-md flex flex-col justify-center gap-3">
        <div className="text-balance text-center">
            <span className="text-sm text-accent">If you&apos;d like to get updates when I write something new, enter your email below!</span>
        </div>
        <SubscriberForm />
    </div>
  )
}

export default SubscribeSection
