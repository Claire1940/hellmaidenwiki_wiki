import type { LucideIcon } from 'lucide-react'
import {
	BookOpen,
	Layers,
	Skull,
	Users,
	Rocket,
	MonitorSmartphone,
	PlayCircle,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：Hell Maiden 7 大内容分类（社区类 community 已排除）
// 顺序：guide 攻略核心 → builds 构筑 → bosses Boss → characters 角色 → release 发布 → platforms 平台 → media 媒体
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'builds', path: '/builds', icon: Layers, isContentType: true },
	{ key: 'bosses', path: '/bosses', icon: Skull, isContentType: true },
	{ key: 'characters', path: '/characters', icon: Users, isContentType: true },
	{ key: 'release', path: '/release', icon: Rocket, isContentType: true },
	{ key: 'platforms', path: '/platforms', icon: MonitorSmartphone, isContentType: true },
	{ key: 'media', path: '/media', icon: PlayCircle, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['guide', 'builds', 'bosses', ...]

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
