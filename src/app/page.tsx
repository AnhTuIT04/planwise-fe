import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      {/* <Toaster position="top-left" /> */}
      {/* Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">planwise</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
              Features
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
              Integrations
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
              Pricing
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
              Love
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-sm text-gray-700 hover:text-gray-900">
              Blog
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-sm text-gray-700">
                Log in
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-full bg-orange-500 px-6 text-sm hover:bg-orange-600">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="mx-auto mb-4 max-w-2xl text-5xl leading-tight font-bold text-balance text-gray-900 md:text-6xl">
          Make work-life balance a reality
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-lg text-pretty text-gray-600">
          The digital daily planner that helps you feel calm and stay focused.
        </p>

        <Button className="mb-2 rounded-full bg-[#e85d4a] px-8 py-6 text-base hover:bg-[#d64d3a]">Try for free</Button>
        <p className="text-xs text-gray-500">14-day free trial · No credit card required</p>
      </section>

      {/* Product Screenshot */}
      <section className="container mx-auto px-6 pb-20">
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-56 border-r border-gray-200 bg-gray-50 p-4">
              <div className="mb-6">
                <div className="mb-4 flex items-center gap-2 text-sm">
                  <span className="font-semibold">pi-mvise</span>
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 rounded px-2 py-1.5 text-gray-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <span>My tasks</span>
                </div>
                <div className="flex items-center gap-2 rounded px-2 py-1.5 text-gray-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <span>Inbox</span>
                </div>
                <div className="flex items-center gap-2 rounded px-2 py-1.5 text-gray-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span>Notification</span>
                </div>
                <div className="flex items-center gap-2 rounded px-2 py-1.5 text-gray-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Planning</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-xs font-semibold text-gray-500">WORKSPACES</div>
                <div className="space-y-1 text-sm">
                  <div className="rounded px-2 py-1.5 text-gray-700">My projects</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-xs font-semibold text-gray-500">RITUALS</div>
                <div className="space-y-1 text-sm">
                  <div className="rounded bg-green-100 px-2 py-1.5 text-gray-700">Daily planning</div>
                  <div className="px-2 py-1.5 text-gray-700">Weekly planning</div>
                </div>
              </div>
            </div>

            {/* Calendar View */}
            <div className="flex-1 p-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <span className="text-sm font-medium text-gray-600">Today</span>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent text-xs">
                    Planned
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent text-xs">
                    Calendars
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Monday */}
                <div>
                  <div className="mb-4 border-b-2 border-green-500 pb-2">
                    <div className="font-semibold text-gray-900">Monday</div>
                    <div className="text-xs text-gray-500">January 8</div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs">
                      <div className="mb-1.5 flex items-center justify-between text-gray-500">
                        <span>9:00</span>
                        <span>1:00</span>
                      </div>
                      <div className="mb-1 font-medium text-gray-900">Build only some feature Packages</div>
                      <div className="text-gray-500">Basic functionality</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs">
                      <div className="mb-1.5 text-gray-500">2:00</div>
                      <div className="mb-1 font-medium text-gray-900">
                        Finish up slide for Every Sunsama customer churn screens
                      </div>
                      <div className="text-gray-500">@growth</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs">
                      <div className="mb-1 font-medium text-gray-900">Coordinate secondary growth channels</div>
                      <div className="text-gray-500">@growth</div>
                    </div>
                    <div className="rounded-lg bg-orange-100 p-3 text-xs">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-orange-700">5:00</span>
                        <span className="text-orange-600">1:00</span>
                      </div>
                      <div className="font-medium text-gray-900">Lunch demo with Jose</div>
                    </div>
                  </div>
                </div>

                {/* Tuesday */}
                <div>
                  <div className="mb-4 border-b-2 border-transparent pb-2">
                    <div className="font-semibold text-gray-900">Tuesday</div>
                    <div className="text-xs text-gray-500">January 9</div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs">
                      <div className="mb-1.5 flex items-center justify-between text-gray-500">
                        <span>+ Add task</span>
                        <span>3:00</span>
                      </div>
                      <div className="mb-1 font-medium text-gray-900">Answer customer support tickets</div>
                      <div className="text-gray-500">@support</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs">
                      <div className="mb-1.5 text-gray-500">3:00</div>
                      <div className="mb-1 font-medium text-gray-900">Investigate secondary growth channels</div>
                      <div className="text-gray-500">@growth</div>
                    </div>
                    <div className="rounded-lg bg-purple-100 p-3 text-xs">
                      <div className="mb-1.5 flex items-center justify-between">
                        <Badge className="bg-purple-600 text-[10px] text-white">ASANA</Badge>
                        <span className="text-purple-600">1:00</span>
                      </div>
                      <div className="mb-1 font-medium text-gray-900">Finish prototype of new feature</div>
                      <div className="text-gray-500">@product</div>
                    </div>
                    <div className="rounded-lg bg-blue-400 p-3 text-xs text-white">
                      <div className="mb-1 flex items-center justify-between">
                        <span>11 am Tomás</span>
                        <span>2:00pm</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wednesday */}
                <div>
                  <div className="mb-4 flex items-center justify-between border-b-2 border-transparent pb-2">
                    <div>
                      <div className="font-semibold text-gray-900">Wednesday</div>
                      <div className="text-xs text-gray-500">January 10</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">10</div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs">
                      <div className="text-gray-500">+ Add task</div>
                    </div>
                    <div className="rounded-lg bg-blue-500 p-3 text-xs text-white">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span>9:00</span>
                        <span>10:00</span>
                      </div>
                      <div className="font-medium">Upgrade to MongoDB 4.4</div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs">
                      <div className="font-medium text-gray-900">Search for local art in Palo Friday</div>
                    </div>
                    <div className="rounded-lg bg-orange-400 p-4 text-xs">
                      <div className="flex items-center justify-between text-orange-900">
                        <span>11:00</span>
                        <span>12:00</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-300 p-3 text-xs">
                      <div className="mb-1.5 flex items-center justify-between text-blue-900">
                        <span>12:00</span>
                        <span>1:00</span>
                      </div>
                      <div className="font-medium text-gray-900">Team 1:1</div>
                    </div>
                    <div className="rounded-lg bg-purple-500 p-8 text-xs text-white">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span>2:00</span>
                        <span>4:00</span>
                      </div>
                      <div className="font-medium">Deep focused on new feature</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-4xl leading-tight font-bold text-gray-900">
              Sync tasks directly from your Notion workspace.
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              Browse your tasks in Notion and pull in the ones you want to work on today.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4l11.733 16h4.267L8.267 4z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Today</span>
                <span className="text-xs text-gray-500">3 hrs and work to finish</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  <div className="flex-1 text-sm">
                    <div className="mb-0.5 text-gray-500">9:00</div>
                    <div className="font-medium text-gray-900">Add task</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  <div className="flex-1 text-sm">
                    <div className="mb-0.5 text-gray-500">10:00</div>
                    <div className="font-medium text-gray-900">Implement new feature from Asana</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  <div className="flex-1 text-sm">
                    <div className="mb-0.5 text-gray-500">11 am Tomás</div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Inbox</span>
                <span className="text-xs text-gray-500">Automations</span>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg border border-gray-200 p-3 text-sm">
                  <div className="mb-1 font-medium text-gray-900">Schedule</div>
                  <div className="text-xs text-gray-500">Tomorrow 9:00 AM</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 text-sm">
                  <div className="mb-1 font-medium text-gray-900">Product demo with Jean</div>
                  <div className="text-xs text-gray-500">Tomorrow 2:00 PM</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 text-sm">
                  <div className="mb-1 font-medium text-gray-900">Product demo with Jean</div>
                  <div className="text-xs text-gray-500">Tomorrow 2:00 PM</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 text-sm">
                  <div className="mb-1 font-medium text-gray-900">Investigate secondary growth channels</div>
                  <div className="text-xs text-gray-500">Tomorrow 3:00 PM</div>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-sm">
                  <div className="mb-1 font-medium text-gray-900">Automatic</div>
                  <div className="text-xs text-gray-500">Draft Animation</div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="mb-4 text-4xl leading-tight font-bold text-gray-900">Set aside time for emails</h2>
            <p className="text-lg leading-relaxed text-gray-600">
              Turn emails that require heads down work into your task list and set aside time to work on them.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md">
                <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-4xl leading-tight font-bold text-gray-900">Synced with your calendars</h2>
            <p className="text-lg leading-relaxed text-gray-600">
              Integrate with Google, Outlook, and iCloud calendars in one place. Sunsama bi-directionally syncs with all
              your calendars.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md">
                <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-md">
                <svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Calendar</span>
                <span className="text-2xl font-bold text-gray-900">21</span>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg bg-green-500 p-3 text-sm text-white">
                  <div className="mb-1 font-medium">Team standup</div>
                  <div className="text-xs">9:00 AM - 9:30 AM</div>
                </div>
                <div className="rounded-lg bg-teal-500 p-3 text-sm text-white">
                  <div className="mb-1 font-medium">Design review</div>
                  <div className="text-xs">10:00 AM - 11:00 AM</div>
                </div>
                <div className="rounded-lg bg-blue-500 p-3 text-sm text-white">
                  <div className="mb-1 font-medium">Client call</div>
                  <div className="text-xs">2:00 PM - 3:00 PM</div>
                </div>
                <div className="rounded-lg bg-orange-500 p-3 text-sm text-white">
                  <div className="mb-1 font-medium">Team sync</div>
                  <div className="text-xs">4:00 PM - 4:30 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24">
        <h2 className="mb-16 text-center text-4xl font-bold text-gray-900">Designed for the way you work</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="border-none bg-white p-8 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Dark Mode</h3>
            <p className="leading-relaxed text-gray-600">Looks good no matter when you work.</p>
          </Card>

          <Card className="border-none bg-white p-8 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Focus Mode</h3>
            <p className="leading-relaxed text-gray-600">Hyper-focus on your most important task.</p>
          </Card>

          <Card className="border-none bg-white p-8 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Auto-scheduling</h3>
            <p className="leading-relaxed text-gray-600">Automatic scheduling your tasks to your calendar.</p>
          </Card>

          <Card className="border-none bg-white p-8 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Weekly Review and Planning</h3>
            <p className="leading-relaxed text-gray-600">Reflect about your weekly goals and progress.</p>
          </Card>

          <Card className="border-none bg-white p-8 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Keyboard shortcuts</h3>
            <p className="leading-relaxed text-gray-600">Work faster and do everything without lifting your hands.</p>
          </Card>

          <Card className="border-none bg-white p-8 shadow-lg">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Analytics</h3>
            <p className="leading-relaxed text-gray-600">Understand how you spend your time.</p>
          </Card>
        </div>
      </section>

      <section className="bg-linear-to-b from-purple-50 to-purple-100 py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Start planning your day.</h2>
          <p className="mb-8 text-lg text-gray-600">Set realistic goals. Stay focused. Go home satisfied.</p>
          <Button className="rounded-full bg-[#e85d4a] px-8 py-6 text-base hover:bg-[#d64d3a]">Try for free</Button>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Help</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    User Manual & Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Compare
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Integrations</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Gmail
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Calendar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Notion
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Team</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Design
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Engineering
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Marketing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Sales
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Product
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            © 2025 Sunsama, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
