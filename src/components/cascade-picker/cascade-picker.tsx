import React, { FC, useState } from 'react'
import { useDebounceFn } from 'ahooks'
import Picker from '../picker'
import type { PickerProps } from '../picker'
import type { PickerValue, PickerValueExtend } from '../picker-view'
import { mergeProps } from '../../utils/with-default-props'
import { useCascadePickerOptions } from './use-cascade-picker-options'
import { generateCascadePickerColumns } from './cascade-picker-utils'

export type CascadePickerOption = {
  label: string
  value: string
  children?: CascadePickerOption[]
}

export type CascadePickerProps = Omit<PickerProps, 'columns'> & {
  options: CascadePickerOption[]
}

const defaultProps = {
  defaultValue: [],
}

export const CascadePicker: FC<CascadePickerProps> = p => {
  const props = mergeProps(defaultProps, p)
  const { options, ...pickerProps } = props
  const { depth, subOptionsRecord } = useCascadePickerOptions(options)

  const [value, setValue] = useState<PickerValue[]>(props.defaultValue)

  const { run: debouncedOnChange } = useDebounceFn(
    (val: PickerValue[], ext: PickerValueExtend) => {
      pickerProps.onSelect?.(val, ext)
    },
    {
      wait: 0,
      leading: false,
      trailing: true,
    }
  )

  return (
    <Picker
      {...pickerProps}
      value={value}
      onSelect={(val, ext) => {
        setValue(val)
        debouncedOnChange(val, ext)
      }}
      columns={selected =>
        generateCascadePickerColumns(
          selected as string[],
          options,
          depth,
          subOptionsRecord
        )
      }
    />
  )
}
