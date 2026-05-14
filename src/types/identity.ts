export interface CompletionSection {
  id: string
  label: string
  filled: boolean
  points: number
  anchor: string
}

export interface CompletionResult {
  score: number
  incomplete: CompletionSection[]
  grade: 'starter' | 'building' | 'strong' | 'elite'
}

export interface DeveloperFormProps {
  data: Record<string, any>
  onChange: (newData: Record<string, any>) => void
  isOwner?: boolean
}
