import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, HelpCircle, Users, FileText, Clock, Shield, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'general', icon: HelpCircle, label: t('faq.categories.general') },
    { id: 'requirements', icon: FileText, label: t('faq.categories.requirements') },
    { id: 'family', icon: Users, label: t('faq.categories.family') },
    { id: 'process', icon: Clock, label: t('faq.categories.process') },
    { id: 'payment', icon: CreditCard, label: t('faq.categories.payment') },
    { id: 'guarantees', icon: Shield, label: t('faq.categories.guarantees') }
  ];

  const faqData = [
    {
      id: '1',
      category: 'general',
      question: t('faq.questions.q1.question'),
      answer: t('faq.questions.q1.answer')
    },
    {
      id: '2',
      category: 'requirements',
      question: t('faq.questions.q2.question'),
      answer: t('faq.questions.q2.answer')
    },
    {
      id: '3',
      category: 'requirements',
      question: t('faq.questions.q3.question'),
      answer: t('faq.questions.q3.answer')
    },
    {
      id: '4',
      category: 'requirements',
      question: t('faq.questions.q4.question'),
      answer: t('faq.questions.q4.answer')
    },
    {
      id: '5',
      category: 'requirements',
      question: t('faq.questions.q5.question'),
      answer: t('faq.questions.q5.answer')
    },
    {
      id: '6',
      category: 'requirements',
      question: t('faq.questions.q6.question'),
      answer: t('faq.questions.q6.answer')
    },
    {
      id: '7',
      category: 'family',
      question: t('faq.questions.q7.question'),
      answer: t('faq.questions.q7.answer')
    },
    {
      id: '8',
      category: 'guarantees',
      question: t('faq.questions.q8.question'),
      answer: t('faq.questions.q8.answer')
    },
    {
      id: '9',
      category: 'process',
      question: t('faq.questions.q9.question'),
      answer: t('faq.questions.q9.answer')
    },
    {
      id: '10',
      category: 'payment',
      question: t('faq.questions.q10.question'),
      answer: t('faq.questions.q10.answer')
    },
    {
      id: '11',
      category: 'process',
      question: t('faq.questions.q11.question'),
      answer: t('faq.questions.q11.answer')
    },
    {
      id: '12',
      category: 'general',
      question: t('faq.questions.q12.question'),
      answer: t('faq.questions.q12.answer')
    },
    {
      id: '13',
      category: 'requirements',
      question: t('faq.questions.q13.question'),
      answer: t('faq.questions.q13.answer')
    },
    {
      id: '14',
      category: 'process',
      question: t('faq.questions.q14.question'),
      answer: t('faq.questions.q14.answer')
    },
    {
      id: '15',
      category: 'requirements',
      question: t('faq.questions.q15.question'),
      answer: t('faq.questions.q15.answer')
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-6 py-2 text-lg font-medium bg-primary/10 text-primary border-primary/20">
                <HelpCircle className="w-5 h-5 mr-2" />
                {t('faq.badge')}
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              {t('faq.title')}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('faq.subtitle')}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder={t('faq.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-primary/20 focus:border-primary rounded-2xl bg-white/80 backdrop-blur shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white/80 backdrop-blur border-primary/10 shadow-xl">
                <h3 className="text-xl font-semibold mb-6 text-foreground">
                  {t('faq.categoriesTitle')}
                </h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                      selectedCategory === null 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'hover:bg-primary/5 text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <HelpCircle className="w-5 h-5" />
                    {t('faq.allCategories')}
                  </button>
                  
                  {categories.map(category => {
                    const Icon = category.icon;
                    const count = faqData.filter(faq => faq.category === category.id).length;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                          selectedCategory === category.id 
                            ? 'bg-primary text-white shadow-lg' 
                            : 'hover:bg-primary/5 text-muted-foreground hover:text-primary'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{category.label}</span>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            selectedCategory === category.id 
                              ? 'bg-white/20 text-white' 
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <Card className="p-8 bg-white/80 backdrop-blur border-primary/10 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">
                    {selectedCategory 
                      ? categories.find(c => c.id === selectedCategory)?.label 
                      : t('faq.allQuestions')
                    }
                  </h2>
                  <Badge variant="outline" className="text-primary border-primary/30">
                    {filteredFAQs.length} {t('faq.questionsCount')}
                  </Badge>
                </div>

                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-muted-foreground mb-2">
                      {t('faq.noResults')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('faq.tryDifferentSearch')}
                    </p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <AccordionItem 
                        key={faq.id} 
                        value={faq.id}
                        className="border border-primary/10 rounded-xl px-6 py-2 bg-gradient-to-r from-primary/5 to-transparent hover:shadow-md transition-all duration-200"
                      >
                        <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4 [&[data-state=open]]:text-primary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-4 pt-2">
                          <div className="prose prose-gray max-w-none">
                            {faq.answer.split('\n').map((paragraph, index) => (
                              paragraph.trim() ? (
                                <p key={index} className="mb-3 last:mb-0">
                                  {paragraph.trim()}
                                </p>
                              ) : null
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('faq.stillHaveQuestions')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t('faq.contactSupport')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@example.com"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t('faq.emailSupport')}
            </a>
            <a 
              href="https://wa.me/+971000000000"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t('faq.whatsappSupport')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;