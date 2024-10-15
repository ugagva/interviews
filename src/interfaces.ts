export interface IInterview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactWatsApp?: string
  contactTelegram?: string
  contactPhone?: string
  createdAt: Date
  salaryFrom?: number
  salaryTo?: number
  stages?: IStage[]
  result?: 'Refusal' | 'Offer'
}

export interface IStage {
  name: string,
  date: Date,
  description: string
}
