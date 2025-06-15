
import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Copy, Download, RotateCcw, Sparkles, Type, Wand2, Stars } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FancyTextGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['bold']);
  const [preserveSpaces, setPreserveSpaces] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [customPrefix, setCustomPrefix] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const { toast } = useToast();

  // Unicode character mappings for different styles
  const characterMaps = {
    bold: {
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
      'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
      '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    },
    italic: {
      'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧',
      'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍'
    },
    boldItalic: {
      'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
      'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
    },
    script: {
      'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
      'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
    },
    monospace: {
      'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
      'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
      '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
    },
    doubleStruck: {
      'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
      'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
      '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
    },
    circled: {
      'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
      'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
      '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
    },
    squared: {
      'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷', 'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿', 'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇', 'y': '🅈', 'z': '🅉',
      'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷', 'I': '🄸', 'J': '🄹', 'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿', 'Q': '🅀', 'R': '🅁', 'S': '🅂', 'T': '🅃', 'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇', 'Y': '🅈', 'Z': '🅉'
    }
  };

  // Special text effects
  const specialEffects = {
    strikethrough: (text: string) => text.split('').map(char => char + '\u0336').join(''),
    underline: (text: string) => text.split('').map(char => char + '\u0332').join(''),
    overline: (text: string) => text.split('').map(char => char + '\u0305').join(''),
    smallCaps: (text: string) => text.toUpperCase().replace(/[A-Z]/g, match => 
      String.fromCharCode(match.charCodeAt(0) - 65 + 7424)
    ),
    upsideDown: (text: string) => {
      const flippedChars: { [key: string]: string } = {
        'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
        'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ᖴ', 'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
        '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
        '.': '˙', ',': "'", '?': '¿', '!': '¡', '"': '„', "'": ',', '(': ')', ')': '('
      };
      return text.toLowerCase().split('').map(char => flippedChars[char] || char).reverse().join('');
    },
    mirror: (text: string) => text.split('').reverse().join(''),
    zalgo: (text: string) => {
      const zalgoChars = [
        '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d', '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b', '\u0346', '\u031a'
      ];
      return text.split('').map(char => {
        let result = char;
        const numDiacritics = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numDiacritics; i++) {
          result += zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
        }
        return result;
      }).join('');
    }
  };

  // Available text styles
  const textStyles = [
    { id: 'bold', name: 'Bold', example: '𝐁𝐨𝐥𝐝 𝐓𝐞𝐱𝐭' },
    { id: 'italic', name: 'Italic', example: '𝐼𝑡𝑎𝑙𝑖𝑐 𝑇𝑒𝑥𝑡' },
    { id: 'boldItalic', name: 'Bold Italic', example: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄' },
    { id: 'script', name: 'Script', example: '𝒮𝒸𝓇𝒾𝓅𝓉 𝒯𝑒𝓍𝓉' },
    { id: 'monospace', name: 'Monospace', example: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎' },
    { id: 'doubleStruck', name: 'Double Struck', example: '𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜' },
    { id: 'circled', name: 'Circled', example: 'Ⓒⓘⓡⓒⓛⓔⓓ Ⓣⓔⓧⓣ' },
    { id: 'squared', name: 'Squared', example: '🅂🅀🅄🄰🅁🄴🄳' },
    { id: 'strikethrough', name: 'Strikethrough', example: 'S̶t̶r̶i̶k̶e̶t̶h̶r̶o̶u̶g̶h̶' },
    { id: 'underline', name: 'Underline', example: 'U̲n̲d̲e̲r̲l̲i̲n̲e̲' },
    { id: 'overline', name: 'Overline', example: 'O̅v̅e̅r̅l̅i̅n̅e̅' },
    { id: 'smallCaps', name: 'Small Caps', example: 'ꜱᴍᴀʟʟ ᴄᴀᴘꜱ' },
    { id: 'upsideDown', name: 'Upside Down', example: 'uʍoᗡ ǝpᴉsd∩' },
    { id: 'mirror', name: 'Mirror', example: 'rorriM' },
    { id: 'zalgo', name: 'Zalgo', example: 'Z̴a̷l̸g̶o̸ T̷e̴x̶t̸' }
  ];

  const generateFancyText = (text: string, styleId: string) => {
    if (!text) return '';

    let result = text;

    // Apply character mapping styles
    if (characterMaps[styleId as keyof typeof characterMaps]) {
      const charMap = characterMaps[styleId as keyof typeof characterMaps];
      result = text.split('').map(char => charMap[char as keyof typeof charMap] || char).join('');
    }
    // Apply special effects
    else if (specialEffects[styleId as keyof typeof specialEffects]) {
      result = specialEffects[styleId as keyof typeof specialEffects](text);
    }

    // Add custom prefix and suffix
    if (customPrefix || customSuffix) {
      result = `${customPrefix}${result}${customSuffix}`;
    }

    // Add emojis if enabled
    if (includeEmojis) {
      const emojis = ['✨', '🌟', '💫', '⭐', '🎨', '🎭', '🎪', '🎯'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      result = `${randomEmoji} ${result} ${randomEmoji}`;
    }

    return result;
  };

  const allGeneratedStyles = useMemo(() => {
    if (!inputText.trim()) return [];

    return textStyles.map(style => ({
      ...style,
      generatedText: generateFancyText(inputText, style.id)
    }));
  }, [inputText, customPrefix, customSuffix, includeEmojis]);

  const copyToClipboard = async (text: string, styleName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${styleName} text has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const copyAllStyles = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to copy",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    const allText = allGeneratedStyles.map(style => 
      `${style.name}: ${style.generatedText}`
    ).join('\n\n');

    try {
      await navigator.clipboard.writeText(allText);
      toast({
        title: "All styles copied",
        description: "All fancy text styles have been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadAsFile = () => {
    if (!inputText.trim()) {
      toast({
        title: "No text to download",
        description: "Please enter some text first.",
        variant: "destructive"
      });
      return;
    }

    const content = allGeneratedStyles.map(style => 
      `${style.name}:\n${style.generatedText}\n`
    ).join('\n');

    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'fancy-text-styles.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "File downloaded",
      description: "All fancy text styles have been downloaded.",
    });
  };

  const clearAll = () => {
    setInputText('');
    setCustomPrefix('');
    setCustomSuffix('');
  };

  const loadSampleText = () => {
    const sampleTexts = [
      "Hello World",
      "Fancy Text Generator",
      "Make it Beautiful",
      "Style Your Text",
      "Creative Typography"
    ];
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    setInputText(sampleTexts[randomIndex]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-purple-500" />
                Advanced Fancy Text Generator
              </CardTitle>
              <CardDescription>
                Transform your text into beautiful, stylish formats using Unicode characters. Perfect for social media, creative writing, and making your text stand out with unique typography styles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Configuration Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="preserve-spaces" className="text-sm font-medium">Preserve Spaces</Label>
                  <Switch
                    id="preserve-spaces"
                    checked={preserveSpaces}
                    onCheckedChange={setPreserveSpaces}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="include-emojis" className="text-sm font-medium">Add Decorative Emojis</Label>
                  <Switch
                    id="include-emojis"
                    checked={includeEmojis}
                    onCheckedChange={setIncludeEmojis}
                  />
                </div>
              </div>

              {/* Custom Prefix/Suffix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-prefix" className="text-sm font-medium">Custom Prefix</Label>
                  <Input
                    id="custom-prefix"
                    placeholder="Add text before (e.g., ✨)"
                    value={customPrefix}
                    onChange={(e) => setCustomPrefix(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-suffix" className="text-sm font-medium">Custom Suffix</Label>
                  <Input
                    id="custom-suffix"
                    placeholder="Add text after (e.g., ✨)"
                    value={customSuffix}
                    onChange={(e) => setCustomSuffix(e.target.value)}
                  />
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="input-text" className="text-lg font-semibold">Input Text</Label>
                  <div className="flex gap-2">
                    <Button onClick={loadSampleText} variant="outline" size="sm">
                      Load Sample
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="input-text"
                  placeholder="Enter your text here to transform it into fancy styles..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[100px] text-base"
                />
              </div>

              {/* Generated Styles */}
              {inputText.trim() && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Generated Fancy Text Styles</Label>
                    <div className="flex gap-2">
                      <Button onClick={copyAllStyles} variant="outline" size="sm" className="flex items-center gap-1">
                        <Copy className="h-4 w-4" />
                        Copy All
                      </Button>
                      <Button onClick={downloadAsFile} variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {allGeneratedStyles.map((style) => (
                      <Card key={style.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{style.name}</Badge>
                            <span className="text-sm text-gray-500">Example: {style.example}</span>
                          </div>
                          <Button
                            onClick={() => copyToClipboard(style.generatedText, style.name)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md font-mono text-lg break-all">
                          {style.generatedText}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics */}
              {inputText.trim() && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{inputText.length}</div>
                    <div className="text-sm text-gray-600">Characters</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{inputText.split(' ').filter(w => w.trim()).length}</div>
                    <div className="text-sm text-gray-600">Words</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{textStyles.length}</div>
                    <div className="text-sm text-gray-600">Styles Generated</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{customPrefix || customSuffix ? 'Yes' : 'No'}</div>
                    <div className="text-sm text-gray-600">Custom Styling</div>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-center pt-4">
                <Button onClick={clearAll} variant="destructive" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Clear All
                </Button>
              </div>

              {/* Style Examples */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Available Text Styles:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                  {textStyles.map((style) => (
                    <div key={style.id} className="flex items-center gap-2">
                      <span className="font-medium">{style.name}:</span>
                      <span className="font-mono">{style.example}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Explanations */}
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Perfect For
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Social media posts and bios</li>
                    <li>• Creative writing and storytelling</li>
                    <li>• Artistic text designs</li>
                    <li>• Making text stand out online</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Stars className="h-4 w-4" />
                    Advanced Features
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Unicode-based transformations</li>
                    <li>• Multiple text styling options</li>
                    <li>• Custom prefix and suffix support</li>
                    <li>• Bulk copy and download functionality</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FancyTextGenerator;
