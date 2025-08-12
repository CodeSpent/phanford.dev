import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import Button from '../common/Button'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function ComingSoonModal({ isOpen, onClose, title }: ComingSoonModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-card-background backdrop-blur-sm border border-gray-800/50 p-6 text-left align-middle shadow-xl transition-all" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)' }}>
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    This feature is coming soon! Stay tuned for updates.
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={onClose}
                  >
                    Got it, thanks!
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}