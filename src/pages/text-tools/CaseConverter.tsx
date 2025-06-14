
import React from "react";
import { Link } from "react-router-dom";

const CaseConverter: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Case Converter</h1>
      <p className="mb-3 text-lg text-gray-700">
        The <strong>Case Converter</strong> is a powerful online tool that allows you to instantly change the case of your text. Convert to upper case, lower case, sentence case, or title case in one click. Ideal for editors, students, and professionals working with content and needing consistent formatting.
      </p>
      <ul className="list-disc pl-6 mb-4 text-gray-800">
        <li>Switch long bodies of text to your preferred style in seconds.</li>
        <li>Perfect for preparing essays, reports, or digital marketing content.</li>
        <li>Preserves punctuation and corrects casing automatically.</li>
      </ul>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Related Text Tools</h2>
        <ul className="list-disc pl-6">
          <li>
            <Link to="/text-tools/text-separator" className="text-blue-600 underline hover:text-blue-800">
              Text Separator
            </Link>
          </li>
          <li>
            <Link to="/text-tools/word-counter" className="text-blue-600 underline hover:text-blue-800">
              Word Counter
            </Link>
          </li>
          <li>
            <Link to="/text-tools/whitespace-cleaner" className="text-blue-600 underline hover:text-blue-800">
              Whitespace Cleaner
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <strong>Explore:</strong>{" "}
        <Link to="/text-tools" className="text-blue-700 hover:underline">All Text Tools</Link>{" | "}
        <Link to="/web-tools" className="text-blue-700 hover:underline">Web Tools</Link>{" | "}
        <Link to="/image-tools" className="text-blue-700 hover:underline">Image Tools</Link>{" | "}
        <Link to="/pdf-tools" className="text-blue-700 hover:underline">PDF Tools</Link>
      </div>
    </div>
  );
};

export default CaseConverter;
