import { Header } from './components/header'
import { Button } from "@/components/ui/button"
import { LoginButton } from './components/login-button'
import { RegisterButton } from './components/register-button'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-20 px-6 bg-gradient-to-r from-primary to-primary-foreground text-white">
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Welcome to TaskMaster</h1>
            <p className="text-xl mb-8">Organize your tasks, boost your productivity</p>
            <div className="space-x-4">
              <LoginButton />
              <RegisterButton />
            </div>
          </div>
        </section>
        <section id="features" className="py-20 px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Create Tasks"
                description="Easily add new tasks to your list"
              />
              <FeatureCard
                title="Organize"
                description="Categorize and prioritize your tasks"
              />
              <FeatureCard
                title="Track Progress"
                description="Monitor your task completion and productivity"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 px-6 bg-gray-100">
        <div className="container mx-auto text-center text-gray-600">
          &copy; 2023 TaskMaster. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

