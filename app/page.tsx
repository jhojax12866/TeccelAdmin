'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code2, Layers, Palette } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              Build beautiful web applications
              <span className="text-primary"> faster</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              A modern starter template with Next.js and shadcn/ui. Build production-ready applications with beautifully designed components.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Palette className="h-8 w-8 mb-4 text-primary" />
                <CardTitle>Beautiful Design</CardTitle>
                <CardDescription>
                  Professionally designed components that look great out of the box.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built on top of Tailwind CSS with a focus on accessibility and user experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code2 className="h-8 w-8 mb-4 text-primary" />
                <CardTitle>Developer Experience</CardTitle>
                <CardDescription>
                  TypeScript and React hooks for a modern development workflow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Full TypeScript support with detailed documentation and examples.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Layers className="h-8 w-8 mb-4 text-primary" />
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Built for scale with performance and accessibility in mind.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Optimized for production with server-side rendering and static generation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}