// components/CreatePollForm.js
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function CreatePollForm() {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  // Character limits
  const MAX_QUESTION_LENGTH = 280;
  const MIN_QUESTION_LENGTH = 10;

  const validateQuestion = (text) => {
    const newErrors = {};
    
    if (!text.trim()) {
      newErrors.question = 'Question is required';
    } else if (text.length < MIN_QUESTION_LENGTH) {
      newErrors.question = `Question must be at least ${MIN_QUESTION_LENGTH} characters`;
    } else if (text.length > MAX_QUESTION_LENGTH) {
      newErrors.question = `Question must be less than ${MAX_QUESTION_LENGTH} characters`;
    } else if (!text.includes('?')) {
      newErrors.question = 'Question should end with a question mark';
    }
    
    return newErrors;
  };

  const handleQuestionChange = (e) => {
    const value = e.target.value;
    setQuestion(value);
    
    // Clear errors when user starts typing
    if (errors.question) {
      setErrors({});
    }
    
    // Auto-show preview when question looks good
    if (value.length >= MIN_QUESTION_LENGTH && value.includes('?')) {
      setShowPreview(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateQuestion(question);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // TODO: Implement actual poll creation with Firebase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Creating poll:', { question: question.trim() });
      
      // Reset form on success
      setQuestion('');
      setShowPreview(false);
      
      // TODO: Redirect to created poll or show success message
      alert('Poll created successfully!');
      
    } catch (error) {
      console.error('Error creating poll:', error);
      setErrors({ submit: 'Failed to create poll. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_QUESTION_LENGTH - question.length;
  const isQuestionValid = question.length >= MIN_QUESTION_LENGTH && 
                         question.length <= MAX_QUESTION_LENGTH && 
                         question.includes('?');

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>✍️</span>
            Create Your Poll
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Ask a <strong>yes/no question</strong> that will spark debate across social platforms!
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">Clear & specific</Badge>
              <Badge variant="outline" className="text-xs">Ends with ?</Badge>
              <Badge variant="outline" className="text-xs">Debate-worthy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-base font-medium">
                Your Question
              </Label>
              <Textarea
                id="question"
                placeholder="Should pineapple go on pizza?"
                value={question}
                onChange={handleQuestionChange}
                className={`min-h-[120px] text-lg resize-none ${
                  errors.question ? 'border-destructive' : ''
                }`}
                maxLength={MAX_QUESTION_LENGTH}
              />
              
              {/* Character Count */}
              <div className="flex justify-between text-sm">
                <div>
                  {errors.question && (
                    <span className="text-destructive">{errors.question}</span>
                  )}
                </div>
                <div className={`${remainingChars < 20 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {remainingChars} characters left
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={!isQuestionValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Poll...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Create Poll
                </>
              )}
            </Button>

            {errors.submit && (
              <Alert variant="destructive">
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </form>

      {/* Live Preview */}
      {showPreview && isQuestionValid && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>👀</span>
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PollPreview question={question.trim()} />
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <span>💡</span>
            Tips for Great Polls
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Good:</strong> "Should remote work be the default for tech jobs?"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✗</span>
              <span><strong>Avoid:</strong> "What's your favorite color?" (not yes/no)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span><strong>Good:</strong> "Is artificial intelligence a threat to humanity?"</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">✗</span>
              <span><strong>Avoid:</strong> "AI is bad" (not a question)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Preview Component
function PollPreview({ question }) {
  return (
    <div className="space-y-4 p-4 border-2 border-dashed border-muted-foreground/20 rounded-lg">
      <h3 className="font-semibold text-lg leading-tight">{question}</h3>
      
      {/* Mock Vote Buttons */}
      <div className="flex gap-3">
        <div className="flex-1 h-14 rounded-xl bg-green-100 border-2 border-green-200 flex items-center justify-center text-green-800 font-bold">
          YES
        </div>
        <div className="flex-1 h-14 rounded-xl bg-red-100 border-2 border-red-200 flex items-center justify-center text-red-800 font-bold">
          NO
        </div>
      </div>
      
      {/* Mock Results */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Results will appear here</span>
          <span>0 votes</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full w-0 transition-all duration-500"></div>
        </div>
      </div>
    </div>
  );
}