import type { Metadata } from 'next'
import SpaceClient from './SpaceClient'

export const metadata: Metadata = {
  title: '공간 소개 | 수담재',
  description:
    '팔작지붕의 아름다운 선, 마루를 따라 흐르는 바람, 육송의 깊은 결이 살아 있는 실내까지. 전통 한옥의 품격 위에 머무는 순간의 감동을 더한 공간입니다.',
}

export default function SpacePage() {
  return <SpaceClient />
}
