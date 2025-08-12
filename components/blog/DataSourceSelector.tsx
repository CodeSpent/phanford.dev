import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import { DataSourceType, getAllDataSources } from 'constants/data-sources'

type Props = {
  selectedDataSource: DataSourceType
}

export default function DataSourceSelector({
  selectedDataSource,
}: Props) {
  const router = useRouter()
  const dataSources = getAllDataSources()
  const selectedDataSourceName = dataSources.find(ds => ds.id === selectedDataSource)?.name || 'Blog'

  return (
    <div>
      <label className="text-xs font-medium text-gray-400 mb-2 block">
        Data Source
      </label>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex items-center text-3xl font-extrabold tracking-tight text-gray-300 sm:text-4xl focus:outline-none">
            {selectedDataSourceName}
            <ChevronDownIcon
              className="ml-2 h-6 w-6 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 mt-2 w-72 origin-top-left divide-y divide-gray-100 rounded-xl bg-card-background border border-gray-800/50 shadow-lg hover:shadow-gray-900/20 ring-1 ring-black ring-opacity-5 focus:outline-none z-[999]">
            <div className="px-1 py-1">
              {dataSources.map((dataSource) => (
                <Menu.Item key={dataSource.id}>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-700/60 text-white' : 'text-gray-300'
                      } group flex flex-col w-full items-start rounded-md px-3 py-3 text-sm transition-all duration-200 hover:bg-gray-700/60 hover:text-white cursor-pointer`}
                      onClick={() => {
                        router.push(`/${dataSource.id}`)
                      }}
                    >
                      <span className="font-semibold text-base">{dataSource.name}</span>
                      <span className="text-gray-400 text-left text-xs mt-1">{dataSource.description}</span>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}
