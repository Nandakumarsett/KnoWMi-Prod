import React from 'react'
import { FieldConfig, PersonaConfig } from '../../../config/personaConfig'
import { TagInput } from '../TagInput'
import { Trash2, Plus } from 'lucide-react'

interface DynamicPersonaFormProps {
  config: PersonaConfig;
  data: any;
  onChange: (newData: any) => void;
}

export function DynamicPersonaForm({ config, data = {}, onChange }: DynamicPersonaFormProps) {
  const updateField = (key: string, value: any) => {
    onChange({ ...data, [key]: value })
  }

  const renderField = (field: FieldConfig, parentData: any, onFieldChange: (val: any) => void) => {
    const val = parentData[field.key]

    switch (field.type) {
      case 'text':
      case 'url':
      case 'number':
        return (
          <input
            type={field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : 'text'}
            value={val || ''}
            onChange={e => onFieldChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
          />
        )

      case 'select':
        return (
          <select
            value={val || ''}
            onChange={e => onFieldChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all"
          >
            <option value="" className="text-black">Select {field.label}</option>
            {(field.options || []).map(opt => (
              <option key={opt} value={opt} className="text-black">{opt}</option>
            ))}
          </select>
        )

      case 'tags':
        return (
          <TagInput
            value={val || []}
            onChange={tags => onFieldChange(tags)}
            suggestions={field.suggestions || []}
          />
        )

      case 'array': {
        const arr = Array.isArray(val) ? val : []
        return (
          <div className="space-y-4">
            {arr.map((item: any, idx: number) => (
              <div key={idx} className="p-5 rounded-[28px] bg-white/5 border border-white/10 space-y-4 relative">
                <button
                  type="button"
                  onClick={() => {
                    const copy = [...arr]
                    copy.splice(idx, 1)
                    onFieldChange(copy)
                  }}
                  className="absolute top-5 right-5 text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(field.itemSchema || []).map(sub => (
                    <div key={sub.key}>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">
                        {sub.label}
                      </label>
                      {renderField(sub, item, (v) => {
                        const copy = [...arr]
                        copy[idx] = { ...item, [sub.key]: v }
                        onFieldChange(copy)
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItem: any = {}
                ;(field.itemSchema || []).forEach(sub => {
                  newItem[sub.key] = ''
                })
                onFieldChange([...arr, newItem])
              }}
              className="w-full p-4 border border-dashed border-white/10 rounded-[28px] hover:bg-white/5 transition-colors text-xs font-black uppercase opacity-60 flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Add {field.label}
            </button>
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {config.fields.map(field => (
        <div key={field.key} className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-widest text-white/70">
            {field.label}
          </label>
          {field.type !== 'array' ? (
            <div className="bg-white/5 p-4 rounded-[28px] border border-white/10">
              {renderField(field, data, (val) => updateField(field.key, val))}
            </div>
          ) : (
            <div>
              {renderField(field, data, (val) => updateField(field.key, val))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
