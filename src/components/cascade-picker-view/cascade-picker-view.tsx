import React, { FC, useState } from 'react'
import { useDebounceFn } from 'ahooks'
import PickerView from '../picker-view'
import type { PickerValue, PickerValueExtend } from '../picker-view'
import { mergeProps } from '../../utils/with-default-props'
import { NativeProps } from '../../utils/native-props'
import type { PickerViewProps } from '../picker-view'
import type { CascadePickerOption } from '../cascade-picker'
import { useCascadePickerOptions } from '../cascade-picker/use-cascade-picker-options'
import { generateCascadePickerColumns } from '../cascade-picker/cascade-picker-utils'

export type CascadePickerViewProps = Omit<PickerViewProps, 'columns'> & {
  options: CascadePickerOption[]
} & NativeProps<'--height'>

const defaultProps = {
  defaultValue: [],
}

export const CascadePickerView: FC<CascadePickerViewProps> = p => {
  const props = mergeProps(defaultProps, p)
  const { options, ...pickerProps } = props
  const { depth, subOptionsRecord } = useCascadePickerOptions(options)

  const [value, setValue] = useState<PickerValue[]>(props.defaultValue)

  const { run: debouncedOnChange } = useDebounceFn(
    (val: PickerValue[], ext: PickerValueExtend) => {
      pickerProps.onChange?.(val, ext)
    },
    {
      wait: 0,
      leading: false,
      trailing: true,
    }
  )

  return (
    <PickerView
      {...pickerProps}
      value={value}
      onChange={(val, ext) => {
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
