import bcrypt from 'bcryptjs'
import { connectDatabase, disconnectDatabase } from './db.js'
import { Activity, Customer, Lead, Notification, Task, User } from './models/index.js'

const seed = async () => {
  await connectDatabase(); await Promise.all([Activity.deleteMany({}), Notification.deleteMany({}), Task.deleteMany({}), Lead.deleteMany({}), Customer.deleteMany({}), User.deleteMany({})])
  const passwordHash = await bcrypt.hash('CRM360-demo-2026', 12)
  const [admin, manager, maya, noah] = await User.create([
    { name: 'Aarav Mehta', email: 'admin@crm360.demo', role: 'Admin', passwordHash },
    { name: 'Priya Shah', email: 'manager@crm360.demo', role: 'Sales Manager', passwordHash },
    { name: 'Maya Rao', email: 'maya@crm360.demo', role: 'Sales Executive', passwordHash },
    { name: 'Noah Wilson', email: 'noah@crm360.demo', role: 'Sales Executive', passwordHash },
  ])
  const leads = await Lead.create([
    { name: 'Rohan Kapoor', company: 'Northstar Studio', email: 'rohan@northstar.example', source: 'Referral', stage: 'New', estimatedValue: 7200, assignedTo: maya._id, createdBy: manager._id, nextAction: 'Send intro email', nextFollowUpAt: new Date(Date.now() - 86400000) },
    { name: 'Elena Torres', company: 'Lumen Learning', email: 'elena@lumen.example', source: 'Website', stage: 'Contacted', estimatedValue: 12800, assignedTo: maya._id, createdBy: manager._id, nextAction: 'Schedule discovery call', nextFollowUpAt: new Date(Date.now() + 86400000) },
    { name: 'Marcus Green', company: 'Greenline Logistics', email: 'marcus@greenline.example', source: 'Event', stage: 'Qualified', estimatedValue: 24600, assignedTo: noah._id, createdBy: manager._id, nextAction: 'Confirm buying committee', nextFollowUpAt: new Date(Date.now() + 3 * 86400000), lastInteractionAt: new Date(Date.now() - 2 * 86400000) },
    { name: 'Sofia Martin', company: 'Vela Properties', email: 'sofia@vela.example', source: 'Partner', stage: 'Proposal Sent', estimatedValue: 18400, assignedTo: noah._id, createdBy: manager._id, nextAction: 'Follow up on proposal', nextFollowUpAt: new Date(Date.now() - 2 * 86400000), lastInteractionAt: new Date(Date.now() - 5 * 86400000) },
    { name: 'Daniel Kim', company: 'Brightwell Health', email: 'daniel@brightwell.example', source: 'Referral', stage: 'Won', estimatedValue: 31200, assignedTo: manager._id, createdBy: admin._id, nextAction: 'Begin onboarding', lastInteractionAt: new Date(Date.now() - 4 * 86400000) },
    { name: 'Jasmine Lee', company: 'Harbor & Co.', email: 'jasmine@harbor.example', source: 'Outbound', stage: 'Lost', estimatedValue: 6400, assignedTo: maya._id, createdBy: manager._id, lostReason: 'Timing', nextAction: 'Revisit next quarter' },
  ])
  const customers = await Customer.create([
    { name: 'Amelia Stone', company: 'Atlas Creative', email: 'amelia@atlas.example', industry: 'Creative services', status: 'Active', source: 'Referral', owner: maya._id, createdBy: manager._id, tags: ['priority', 'retainer'], notes: 'Quarterly review scheduled.' },
    { name: 'Ishan Patel', company: 'Coregrid Labs', email: 'ishan@coregrid.example', industry: 'SaaS', status: 'At Risk', source: 'Website', owner: noah._id, createdBy: manager._id, tags: ['renewal'], notes: 'Needs executive check-in before renewal.' },
    { name: 'Nora Bennett', company: 'Cedar Works', email: 'nora@cedar.example', industry: 'Professional services', status: 'Active', source: 'Partner', owner: manager._id, createdBy: admin._id, tags: ['expansion'] },
  ])
  const tasks = await Task.create([
    { title: 'Send discovery recap to Northstar', description: 'Share the agreed next steps and calendar options.', status: 'Pending', priority: 'High', dueDate: new Date(Date.now() - 86400000), assignedTo: maya._id, createdBy: manager._id, relatedLead: leads[0]._id },
    { title: 'Prepare Vela proposal follow-up', status: 'In Progress', priority: 'Urgent', dueDate: new Date(Date.now() + 86400000), assignedTo: noah._id, createdBy: manager._id, relatedLead: leads[3]._id },
    { title: 'Review Coregrid renewal health', status: 'Pending', priority: 'Medium', dueDate: new Date(Date.now() + 3 * 86400000), assignedTo: noah._id, createdBy: manager._id, relatedCustomer: customers[1]._id },
    { title: 'Close onboarding checklist', status: 'Completed', priority: 'Low', dueDate: new Date(Date.now() - 3 * 86400000), completedAt: new Date(Date.now() - 2 * 86400000), assignedTo: manager._id, createdBy: admin._id, relatedLead: leads[4]._id },
  ])
  await Activity.create([
    { type: 'lead_created', description: 'Created Northstar Studio lead', actor: manager._id, lead: leads[0]._id },
    { type: 'customer_created', description: 'Added Atlas Creative as a customer', actor: maya._id, customer: customers[0]._id },
    { type: 'stage_changed', description: 'Moved Vela Properties to Proposal Sent', actor: noah._id, lead: leads[3]._id },
    { type: 'task_completed', description: 'Completed onboarding checklist', actor: manager._id, task: tasks[3]._id },
  ])
  await Notification.create([
    { recipient: maya._id, type: 'task_assigned', title: 'Overdue task', message: 'Send discovery recap to Northstar is overdue.', relatedEntityType: 'task', relatedEntityId: tasks[0]._id },
    { recipient: noah._id, type: 'lead_stage_changed', title: 'Proposal needs attention', message: 'Vela Properties is waiting on a response.', relatedEntityType: 'lead', relatedEntityId: leads[3]._id },
  ])
  console.log('Seeded CRM360 demo data')
  console.log('Demo password: CRM360-demo-2026')
  await disconnectDatabase()
}
seed().catch(async (error) => { console.error(error); await disconnectDatabase(); process.exit(1) })
