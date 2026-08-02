export type Role = 'Admin' | 'Sales Manager' | 'Sales Executive'
export type LeadStage = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost'
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export interface User { id: string; _id?: string; name: string; email: string; role: Role; phone?: string; active: boolean }
export interface Customer { _id: string; name: string; company: string; email: string; phone?: string; industry?: string; status: 'Active' | 'At Risk' | 'Inactive'; source?: string; owner?: User; notes?: string; tags?: string[]; createdAt: string }
export interface Lead { _id: string; name: string; company: string; email: string; phone?: string; source?: string; stage: LeadStage; estimatedValue: number; expectedCloseDate?: string; assignedTo?: User; nextAction: string; nextFollowUpAt?: string; lastInteractionAt?: string; notes?: string; convertedCustomer?: Customer; convertedAt?: string }
export interface Task { _id: string; title: string; description?: string; status: TaskStatus; priority: TaskPriority; dueDate: string; assignedTo?: User; relatedLead?: Lead; relatedCustomer?: Customer }
export interface Activity { _id: string; type: string; description: string; createdAt: string; actor?: User }
export interface DashboardData { metrics: { totalCustomers: number; activeLeads: number; pendingTasks: number; wonDeals: number; lostDeals: number; wonDealValue: number }; leadsByStage: { _id: LeadStage; count: number; value: number }[]; tasksByStatus: { _id: TaskStatus; count: number }[]; recentActivity: Activity[]; dueSoon: Task[]; focusQueue: { overdueTasks: number; overdueFollowUps: number; noActivity: number } }
