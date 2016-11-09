
export interface Question {
  id: string,
  type: string,
  title: string,
  options: {
    label: string,
    next: string
  }[]
}



