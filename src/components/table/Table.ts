export type Header = {
  align: ALIGNMENT,
  width: WIDTH,
  key: string,
  title: string
}

export enum ALIGNMENT {
  RIGHT = 'right',
  LEFT  = 'left'
}

export enum WIDTH {
  ONE    = 'one',
  TWO    = 'two',
  THREE  = 'three',
  FOUR   = 'four',
  FIVE   = 'five',
  SIX    = 'six',
  SEVEN  = 'seven',
  EIGHTH = 'eighth',
  NINE   = 'nine',
  TEN    = 'ten',
  ELEVEN = 'eleven',
  TWELVE = 'twelve',
}
