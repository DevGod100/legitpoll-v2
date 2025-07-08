// components/polls/PollCreator.js
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPoll } from '@/lib/pollUtils';

export default function PollCreator() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    option1: '',
    option2: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session) {
      alert('Please sign in to create a poll');
      return;
    }

    if (!formData.question.trim() || !formData.option1.trim() || !formData.option2.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const pollId = await createPoll({
        question: formData.question.trim(),
        option1: formData.option1.trim(),
        option2: formData.option2.trim()
      });

      // Redirect to the new poll
      router.push(`/poll/${pollId}`);
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!session) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground mb-4">Please sign in to create a poll</p>
          <Button onClick={() => router.push('/')}>
            Go to Homepage
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Create New Poll</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Start a debate between Twitter and Reddit users
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Question Input */}
            <div className="space-y-2">
              <Label htmlFor="question">Poll Question</Label>
              <Input
                id="question"
                placeholder="e.g., Who was the better president?"
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {formData.question.length}/200 characters
              </p>
            </div>

            {/* Option 1 */}
            <div className="space-y-2">
              <Label htmlFor="option1">First Option</Label>
              <Input
                id="option1"
                placeholder="e.g., Biden"
                value={formData.option1}
                onChange={(e) => handleInputChange('option1', e.target.value)}
                maxLength={50}
              />
            </div>

            {/* Option 2 */}
            <div className="space-y-2">
              <Label htmlFor="option2">Second Option</Label>
              <Input
                id="option2"
                placeholder="e.g., Trump"
                value={formData.option2}
                onChange={(e) => handleInputChange('option2', e.target.value)}
                maxLength={50}
              />
            </div>

            {/* Preview */}
            {formData.question && formData.option1 && formData.option2 && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <h3 className="font-medium mb-3">{formData.question}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded text-center text-sm">
                    {formData.option1}
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900 rounded text-center text-sm">
                    {formData.option2}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !formData.question.trim() || !formData.option1.trim() || !formData.option2.trim()}
            >
              {loading ? 'Creating Poll...' : 'Create Poll'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}