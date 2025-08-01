
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calculator, DollarSign, Percent, Calendar, TrendingUp, Home } from 'lucide-react';

const tools = [
  {
    name: 'Basic Calculator',
    description: 'Perform basic arithmetic operations with an easy-to-use interface. Perfect for quick calculations, percentages, and everyday math tasks with full keyboard support.',
    link: '/tools/calculators/BasicCalculator',
    icon: <Calculator className="h-8 w-8 text-blue-500" />
  },
  {
    name: 'Loan Calculator',
    description: 'Calculate monthly payments, total interest, and amortization schedules for mortgages, auto loans, and personal loans. Make informed financial decisions with detailed breakdowns.',
    link: '/tools/calculators/LoanCalculator',
    icon: <DollarSign className="h-8 w-8 text-green-500" />
  },
  {
    name: 'Percentage Calculator',
    description: 'Calculate percentages, percentage increases, decreases, and percentage of totals. Essential for discounts, tax calculations, tips, and statistical analysis.',
    link: '/tools/calculators/PercentageCalculator',
    icon: <Percent className="h-8 w-8 text-purple-500" />
  },
  {
    name: 'Date Calculator',
    description: 'Calculate differences between dates, add or subtract days from dates, and determine business days. Perfect for project planning and deadline management.',
    link: '/tools/calculators/DateCalculator',
    icon: <Calendar className="h-8 w-8 text-orange-500" />
  },
  {
    name: 'Investment Calculator',
    description: 'Calculate compound interest, investment returns, and retirement savings. Plan your financial future with detailed projections and growth scenarios.',
    link: '/tools/calculators/InvestmentCalculator',
    icon: <TrendingUp className="h-8 w-8 text-red-500" />
  },
  {
    name: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments, total interest costs, and compare different loan scenarios. Essential tool for home buyers and refinancing decisions.',
    link: '/tools/calculators/MortgageCalculator',
    icon: <Home className="h-8 w-8 text-indigo-500" />
  },
];

const basicCalculators = [
    { name: 'Basic Calculator', description: 'Standard calculator with arithmetic operations and memory functions.', link: '/tools/calculators/BasicCalculator' },
    { name: 'Scientific Calculator', description: 'Advanced calculator with trigonometric and logarithmic functions.', link: '/tools/calculators/ScientificCalculator' },
    { name: 'Fraction Calculator', description: 'Perform calculations with fractions and mixed numbers.', link: '/tools/calculators/FractionCalculator' },
    { name: 'Percentage Calculator', description: 'Calculate percentages, increases, decreases, and ratios.', link: '/tools/calculators/PercentageCalculator' },
    { name: 'Square Root Calculator', description: 'Calculate square roots and other radical expressions.', link: '/tools/calculators/SquareRootCalculator' },
    { name: 'Algebra Calculator', description: 'Solve algebraic equations and expressions step by step.', link: '/tools/calculators/AlgebraCalculator' },
    { name: 'Binary Calculator', description: 'Perform calculations in binary, octal, and hexadecimal.', link: '/tools/calculators/BinaryCalculator' },
    { name: 'Matrix Calculator', description: 'Perform matrix operations like multiplication and determinants.', link: '/tools/calculators/MatrixCalculator' },
];

const financialCalculators = [
    { name: 'Loan Calculator', description: 'Calculate monthly payments and total interest for any loan.', link: '/tools/calculators/LoanCalculator' },
    { name: 'Mortgage Calculator', description: 'Calculate mortgage payments with taxes and insurance.', link: '/tools/calculators/MortgageCalculator' },
    { name: 'Investment Calculator', description: 'Calculate compound interest and investment growth.', link: '/tools/calculators/InvestmentCalculator' },
    { name: 'Retirement Calculator', description: 'Plan your retirement savings and withdrawal strategy.', link: '/tools/calculators/RetirementCalculator' },
    { name: 'Tax Calculator', description: 'Estimate federal and state income taxes.', link: '/tools/calculators/TaxCalculator' },
    { name: 'Salary Calculator', description: 'Convert between hourly, weekly, monthly, and annual salaries.', link: '/tools/calculators/SalaryCalculator' },
    { name: 'Budget Calculator', description: 'Create and manage personal or business budgets.', link: '/tools/calculators/BudgetCalculator' },
    { name: 'ROI Calculator', description: 'Calculate return on investment for business decisions.', link: '/tools/calculators/ROICalculator' },
    { name: 'Currency Converter', description: 'Convert between different currencies with live rates.', link: '/tools/calculators/CurrencyConverter' },
    { name: 'Tip Calculator', description: 'Calculate tips and split bills among multiple people.', link: '/tools/calculators/TipCalculator' },
];

const conversionCalculators = [
    { name: 'Unit Converter', description: 'Convert between different units of measurement.', link: '/tools/calculators/UnitConverter' },
    { name: 'Temperature Converter', description: 'Convert between Celsius, Fahrenheit, and Kelvin.', link: '/tools/calculators/TemperatureConverter' },
    { name: 'Length Converter', description: 'Convert between inches, feet, meters, kilometers, etc.', link: '/tools/calculators/LengthConverter' },
    { name: 'Weight Converter', description: 'Convert between pounds, kilograms, ounces, and more.', link: '/tools/calculators/WeightConverter' },
    { name: 'Volume Converter', description: 'Convert between liters, gallons, cups, and other volumes.', link: '/tools/calculators/VolumeConverter' },
    { name: 'Area Calculator', description: 'Calculate areas of rectangles, circles, triangles, and more.', link: '/tools/calculators/AreaCalculator' },
    { name: 'Speed Converter', description: 'Convert between mph, km/h, and other speed units.', link: '/tools/calculators/SpeedConverter' },
    { name: 'Time Zone Converter', description: 'Convert times between different time zones worldwide.', link: '/tools/calculators/TimeZoneConverter' },
];

const specialtyCalculators = [
    { name: 'Date Calculator', description: 'Calculate differences between dates and add/subtract days.', link: '/tools/calculators/DateCalculator' },
    { name: 'Age Calculator', description: 'Calculate exact age in years, months, and days.', link: '/tools/calculators/AgeCalculator' },
    { name: 'BMI Calculator', description: 'Calculate Body Mass Index and health recommendations.', link: '/tools/calculators/BMICalculator' },
    { name: 'Calorie Calculator', description: 'Calculate daily caloric needs and burn rates.', link: '/tools/calculators/CalorieCalculator' },
    { name: 'GPA Calculator', description: 'Calculate grade point averages for students.', link: '/tools/calculators/GPACalculator' },
    { name: 'Fuel Cost Calculator', description: 'Calculate fuel costs for trips and compare vehicles.', link: '/tools/calculators/FuelCostCalculator' },
    { name: 'Paint Calculator', description: 'Calculate how much paint needed for walls and rooms.', link: '/tools/calculators/PaintCalculator' },
    { name: 'Pregnancy Calculator', description: 'Calculate due dates and pregnancy milestones.', link: '/tools/calculators/PregnancyCalculator' },
];

const Calculators = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Comprehensive Online Calculators
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
                Professional-grade calculators for every need. From basic arithmetic to complex financial planning, scientific calculations, and unit conversions - all free and easy to use.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
                <Link to={tool.link} key={tool.name} className="block group">
                  <Card className="h-full hover:shadow-lg hover:border-blue-500 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <div>{tool.icon}</div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="py-12 md:py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">All Our Calculators</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">Solve any calculation problem with our comprehensive collection of specialized calculators for every situation and profession.</p>
                </div>

                <div className="space-y-16">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic & Scientific</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {basicCalculators.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Financial & Business</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {financialCalculators.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Conversion & Units</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {conversionCalculators.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Specialty & Lifestyle</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {specialtyCalculators.map((tool) => (
                                <Link to={tool.link} key={tool.name} className="block group">
                                    <Card className="h-full hover:shadow-lg transition-shadow duration-300 p-4">
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{tool.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Why Use Professional Online Calculators?</h2>
                <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                    <p className="text-xl leading-relaxed">
                        In our data-driven world, accurate calculations are fundamental to making informed decisions, whether you're managing personal finances, running a business, planning projects, or solving complex mathematical problems. The right calculator can mean the difference between costly mistakes and profitable outcomes, between missed opportunities and strategic success. Professional-grade online calculators provide the precision, convenience, and specialized functionality that modern professionals, students, and individuals need to tackle any computational challenge with confidence.
                    </p>
                    
                    <p className="leading-relaxed">
                        Traditional calculators and manual calculations are not only time-consuming but also prone to human error, especially when dealing with complex formulas, multiple variables, or repetitive calculations. Financial decisions involving loans, investments, or business planning require sophisticated calculations that consider compound interest, tax implications, and various scenarios. Similarly, scientific and engineering problems often involve complex mathematical operations that are difficult to perform accurately without proper tools.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Essential Financial Planning & Analysis Tools</h3>
                    
                    <p className="leading-relaxed">
                        Financial literacy and smart money management are crucial life skills that depend heavily on accurate calculations and scenario analysis. Our <Link to="/tools/calculators/loan-calculator" className="text-blue-600 hover:underline font-medium">Loan Calculator</Link> helps you understand the true cost of borrowing by calculating monthly payments, total interest, and amortization schedules for any loan amount, term, and interest rate. This empowers you to compare loan offers, negotiate better terms, and make informed borrowing decisions that can save thousands of dollars over the life of a loan.
                    </p>
                    
                    <p className="leading-relaxed">
                        For home buyers, our <Link to="/tools/calculators/mortgage-calculator" className="text-blue-600 hover:underline font-medium">Mortgage Calculator</Link> goes beyond basic payment calculations to include property taxes, insurance, and PMI, giving you a complete picture of homeownership costs. The <Link to="/tools/calculators/investment-calculator" className="text-blue-600 hover:underline font-medium">Investment Calculator</Link> uses compound interest formulas to project long-term growth, helping you understand how small changes in contribution amounts or starting ages can dramatically impact your retirement savings. Our <Link to="/tools/calculators/retirement-calculator" className="text-blue-600 hover:underline font-medium">Retirement Calculator</Link> takes this further by factoring in inflation, multiple income sources, and withdrawal strategies to create comprehensive retirement plans.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Advanced Mathematical & Scientific Computing</h3>
                    
                    <p className="leading-relaxed">
                        Students, engineers, scientists, and researchers require sophisticated mathematical tools that go far beyond basic arithmetic. Our <Link to="/tools/calculators/scientific-calculator" className="text-blue-600 hover:underline font-medium">Scientific Calculator</Link> provides all the trigonometric, logarithmic, and exponential functions needed for advanced mathematics, physics, and engineering coursework. The interface is designed to handle complex expressions with proper order of operations, parentheses grouping, and memory functions that allow for multi-step calculations.
                    </p>
                    
                    <p className="leading-relaxed">
                        For computer science and digital engineering applications, our <Link to="/tools/calculators/binary-calculator" className="text-blue-600 hover:underline font-medium">Binary Calculator</Link> performs calculations in binary, octal, and hexadecimal number systems, essential for programming, digital circuit design, and computer architecture work. The <Link to="/tools/calculators/matrix-calculator" className="text-blue-600 hover:underline font-medium">Matrix Calculator</Link> handles complex linear algebra operations including matrix multiplication, determinant calculations, and system solving—critical tools for advanced mathematics, engineering, and data science applications.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Comprehensive Unit Conversion & Measurement Tools</h3>
                    
                    <p className="leading-relaxed">
                        In our globalized world, the ability to quickly and accurately convert between different measurement systems is essential for international business, scientific research, cooking, construction, and countless other applications. Our <Link to="/tools/calculators/unit-converter" className="text-blue-600 hover:underline font-medium">Unit Converter</Link> handles conversions between metric and imperial systems for length, weight, volume, temperature, and area measurements with precision that eliminates costly mistakes.
                    </p>
                    
                    <p className="leading-relaxed">
                        The <Link to="/tools/calculators/currency-converter" className="text-blue-600 hover:underline font-medium">Currency Converter</Link> uses real-time exchange rates to provide accurate conversions for international transactions, travel planning, and global business operations. For project managers and international teams, our <Link to="/tools/calculators/timezone-converter" className="text-blue-600 hover:underline font-medium">Time Zone Converter</Link> eliminates confusion when scheduling meetings, deadlines, and coordinating activities across different time zones worldwide.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Specialized Lifestyle & Health Calculators</h3>
                    
                    <p className="leading-relaxed">
                        Personal health management and lifestyle planning benefit greatly from accurate calculations and data-driven insights. Our <Link to="/tools/calculators/bmi-calculator" className="text-blue-600 hover:underline font-medium">BMI Calculator</Link> provides not just basic body mass index calculations but also health recommendations and goal-setting guidance based on current health guidelines. The <Link to="/tools/calculators/calorie-calculator" className="text-blue-600 hover:underline font-medium">Calorie Calculator</Link> determines daily caloric needs based on age, gender, activity level, and goals, essential for weight management and fitness planning.
                    </p>
                    
                    <p className="leading-relaxed">
                        For students and parents, our <Link to="/tools/calculators/gpa-calculator" className="text-blue-600 hover:underline font-medium">GPA Calculator</Link> handles weighted and unweighted grade calculations, helping track academic progress and plan for college admissions requirements. The <Link to="/tools/calculators/age-calculator" className="text-blue-600 hover:underline font-medium">Age Calculator</Link> and <Link to="/tools/calculators/date-calculator" className="text-blue-600 hover:underline font-medium">Date Calculator</Link> are invaluable for legal documents, insurance applications, project planning, and personal milestone tracking.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Integration with Complete Professional Toolkit</h3>
                    
                    <p className="leading-relaxed">
                        Professional work rarely involves calculations in isolation—they're typically part of larger projects that require diverse tools and capabilities. Our calculator suite integrates seamlessly with the complete ZipConvert ecosystem, allowing you to move fluidly between mathematical analysis and other essential tasks without losing context or breaking your workflow momentum.
                    </p>
                    
                    <p className="leading-relaxed">
                        After performing financial calculations, you might need our <Link to="/tools/text" className="text-blue-600 hover:underline font-medium">Text Tools</Link> to format reports or create professional documentation of your analysis. Business presentations often require our <Link to="/tools/image" className="text-blue-600 hover:underline font-medium">Image Tools</Link> for creating charts and graphs, or our <Link to="/tools/pdf" className="text-blue-600 hover:underline font-medium">PDF Tools</Link> for combining multiple documents into comprehensive reports.
                    </p>
                    
                    <p className="leading-relaxed">
                        For web-based financial tools or business applications, our <Link to="/tools/web" className="text-blue-600 hover:underline font-medium">Web Tools</Link> provide the technical infrastructure for creating interactive calculators and forms. Project organization and task management benefit from our <Link to="/tools/productivity" className="text-blue-600 hover:underline font-medium">Productivity</Link> tools, while data security requirements are met by our <Link to="/tools/security" className="text-blue-600 hover:underline font-medium">Security Tools</Link> for protecting sensitive financial information.
                    </p>

                    <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Precision, Accessibility, and Professional Reliability</h3>
                    
                    <p className="leading-relaxed">
                        Professional calculations demand absolute accuracy and reliability. All our calculators use precision mathematical libraries and algorithms that handle edge cases, rounding errors, and complex computational challenges that can trip up basic calculator applications. Whether you're calculating compound interest over decades, solving complex engineering equations, or converting between obscure measurement units, you can trust the accuracy of your results.
                    </p>
                    
                    <p className="leading-relaxed">
                        Our calculators are designed for universal accessibility, working seamlessly across all devices and platforms without requiring downloads or installations. The interfaces are optimized for both quick single calculations and complex multi-step problem solving, with memory functions, history tracking, and copy-paste capabilities that support professional workflows. We prioritize user privacy and data security, ensuring that your calculations and sensitive information are handled responsibly and never stored longer than necessary.
                    </p>
                    
                    <p className="text-lg leading-relaxed mt-8 font-medium text-gray-800">
                        Make informed decisions with confidence using professional-grade calculators designed for accuracy and efficiency. Start exploring our comprehensive calculation suite today and discover how the right computational tools can enhance your personal and professional success.
                    </p>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Calculators;
