'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  placeholder?: string
  onRefresh?: () => Promise<Array<{ value: string; label: string }>>
}

export const ModelSelector = ({
  value,
  onChange,
  options,
  placeholder = 'Enter model name...',
  onRefresh,
}: ModelSelectorProps) => {
  const [isCustom, setIsCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dynamicOptions, setDynamicOptions] = useState<Array<{ value: string; label: string }>>([])

  // Combine static options with dynamically fetched options
  const mergedOptions = [...options, ...dynamicOptions.filter((d) => !options.some((o) => o.value === d.value))]

  // Check if the current value is among the predefined options
  useEffect(() => {
    const isInOptions = mergedOptions.some((option) => option.value === value)
    if (!isInOptions && value) {
      setIsCustom(true)
      setCustomValue(value)
    } else {
      setIsCustom(false)
      setCustomValue('')
    }
  }, [value, mergedOptions])

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === 'custom') {
      setIsCustom(true)
      setCustomValue(value)
    } else {
      setIsCustom(false)
      setCustomValue('')
      onChange(selectedValue)
    }
  }

  const handleCustomChange = (customVal: string) => {
    setCustomValue(customVal)
    onChange(customVal)
  }

  const handleRefresh = async () => {
    if (!onRefresh) return
    setIsRefreshing(true)
    try {
      const fetched = await onRefresh()
      setDynamicOptions(fetched)
    } catch (error) {
      console.error('Failed to refresh models:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className='space-y-2'>
      <div className='flex gap-1 items-center'>
        <Select value={isCustom ? 'custom' : value} onValueChange={handleSelectChange}>
          <SelectTrigger className='flex-1'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mergedOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
            <SelectItem value='custom'>Custom / 自定义</SelectItem>
          </SelectContent>
        </Select>
        {onRefresh && (
          <Button
            size='icon'
            variant='ghost'
            className='h-9 w-9 flex-shrink-0'
            disabled={isRefreshing}
            onClick={handleRefresh}
            type='button'
          >
            <RotateCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </Button>
        )}
      </div>
      {isCustom && (
        <Input value={customValue} onChange={(e) => handleCustomChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  )
}
