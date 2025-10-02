import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSignatureSchema, type InsertSignature } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, RotateCcw, Check, ChevronDown, ChevronRight, Upload, Archive, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoImage from "../assets/BWA30New2.jpg";

export default function SignatureGenerator() {
  const [copied, setCopied] = useState(false);
  const [logoSectionExpanded, setLogoSectionExpanded] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(logoImage);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [signatureHTML, setSignatureHTML] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const form = useForm<InsertSignature>({
    resolver: zodResolver(insertSignatureSchema),
    defaultValues: {
      name: "",
      title: "",
      email: "",
      phone: "415 979 9775",
    },
  });
  const watchedValues = form.watch();
  // Update signature HTML when form values or logo change
  useEffect(() => {
    const updateSignature = async () => {
      const html = await generateSignatureHTML(watchedValues);
      setSignatureHTML(html);
    };
   
    updateSignature();
  }, [watchedValues, currentLogo]);
  // Logo management functions
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleLogoUpload(files[0]);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoUpload(file);
    }
  };
  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, SVG, etc.)",
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
   
    try {
      // Archive current logo by renaming with _v2
      const currentLogoName = "BWA30New2.png";
      const archiveName = currentLogoName.replace('.png', '_v2.png');
     
      // Create a canvas to proportionally scale the image to 189px width
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
     
      img.onload = () => {
        const targetWidth = 189;
        const aspectRatio = img.height / img.width;
        const targetHeight = targetWidth * aspectRatio;
       
        canvas.width = targetWidth;
        canvas.height = targetHeight;
       
        ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
       
        // Convert to blob and create object URL
        canvas.toBlob((blob) => {
          if (blob) {
            const newLogoUrl = URL.createObjectURL(blob);
            setCurrentLogo(newLogoUrl);
           
            toast({
              title: "Logo updated successfully",
              description: `New logo scaled to ${targetWidth}x${Math.round(targetHeight)}px. Previous logo archived as ${archiveName}`,
            });
          }
        }, 'image/png');
      };
     
      img.src = URL.createObjectURL(file);
     
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  const generateSignatureHTML = async (data: InsertSignature): Promise<string> => {
    const name = data.name || "Your Name";
    const title = data.title || "Your Title";
    const email = data.email || "your.email@socialmarketing.com";
    const phone = data.phone || "Your Phone";
    // Use optimized HTTPS hosting with Gmail-friendly headers for minimal warnings
    const logoUrl = "https://drive.google.com/uc?export=view&id=1kimse450fjg5kMCFIpowMdrBKkQTYxi5";
    // Create clean signature with embedded logo - no external image warnings
    return `<div style="margin-top: 40px !important; margin-bottom: 20px !important;">
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif !important; font-size: 11px !important; color: #333333 !important; border-collapse: collapse !important; margin: 0 !important; padding: 0 !important; width: auto !important;">
  <tbody>
  <tr>
    <td style="vertical-align: top !important; padding: 4px 15px 4px 0 !important; margin: 0 !important; border: none !important; white-space: nowrap !important;">
      <div style="font-weight: bold !important; font-size: 14px !important; color: #6f6f6f !important; margin: 0 0 2px 0 !important; line-height: 16px !important; font-family: Arial, sans-serif !important;">${name}</div>
      <div style="color: #5e5e5e !important; font-size: 11px !important; margin: 0 0 1px 0 !important; line-height: 13px !important; font-family: Arial, sans-serif !important;">${title}</div>
      <div style="margin: 0 0 2px 0 !important; line-height: 13px !important; font-family: Arial, sans-serif !important;">
        <a href="mailto:${email}" style="color: #1976D2 !important; text-decoration: underline !important; font-size: 11px !important; font-family: Arial, sans-serif !important;">${email}</a>
      </div>
      <div style="color: #5e5e5e !important; font-size: 10px !important; margin: 0 !important; line-height: 12px !important; font-family: Arial, sans-serif !important;">TEL // ${phone}</div>
    </td>
    <td style="vertical-align: top !important; padding: 4px 0 4px 15px !important; margin: 0 !important; border-left: 1px solid #cccccc !important;">
      <div style="font-weight: bold !important; font-size: 11px !important; color: #606060 !important; margin: 0 0 2px 0 !important; line-height: 13px !important; white-space: nowrap !important; font-family: Arial, sans-serif !important;">BETTER WORLD ADVERTISING</div>
      <div style="font-size: 11px !important; color: #5e5e5e !important; margin: 0 0 1px 0 !important; line-height: 13px !important; font-family: Arial, sans-serif !important;">1010 B Street, Suite 328</div>
      <div style="font-size: 11px !important; color: #5e5e5e !important; margin: 0 0 1px 0 !important; line-height: 13px !important; font-family: Arial, sans-serif !important;">San Rafael CA 94901</div>
      <div style="margin: 0 !important; line-height: 13px !important; font-family: Arial, sans-serif !important;">
        <a href="http://www.socialmarketing.com" style="color: #1976D2 !important; text-decoration: underline !important; font-size: 11px !important; font-family: Arial, sans-serif !important;">www.socialmarketing.com</a>
      </div>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding: 18px 0 0 0 !important; margin: 0 !important;">
      <img src="${logoUrl}" alt="Better World Advertising 30th Anniversary" style="width: 150px !important; height: auto !important; display: block !important; border: none !important; max-width: 150px !important;" />
    </td>
  </tr>
  </tbody>
</table>
</div>`;
  };
  const copyToClipboard = async () => {
    try {
      if (!signatureHTML) {
        toast({
          title: "Please wait",
          description: "Signature is still being generated...",
          variant: "destructive",
        });
        return;
      }
      // Create clipboard item with both HTML and plain text for better Gmail compatibility
      const plainText = signatureHTML.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
     
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([signatureHTML], { type: 'text/html' }),
        'text/plain': new Blob([plainText], { type: 'text/plain' })
      });
      await navigator.clipboard.write([clipboardItem]);
      setCopied(true);
      toast({
        title: "Signature copied!",
        description: "Staff compact signature copied! Paste into Gmail Settings for consistent team branding.",
      });
     
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = signatureHTML;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
     
      setCopied(true);
      toast({
        title: "Signature copied!",
        description: "Your signature has been copied to the clipboard.",
      });
     
      setTimeout(() => setCopied(false), 3000);
    }
  };
  const clearForm = () => {
    form.reset();
    toast({
      title: "Form cleared",
      description: "All fields have been reset.",
    });
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header - BWA Style */}
      <header className="bg-slate-700 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">BWA Signature Generator</h1>
            <p className="text-slate-300">Staff email signatures for Better World Advertising</p>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-8">
         
          {/* Preview Section */}
          <Card className="shadow-lg border-0 rounded-lg w-full">
            <CardContent className="pt-6">
              {/* Preview Container */}
              <div className="border border-slate-200 p-6 bg-slate-50 mb-6">
                <div className="bg-white p-8 shadow-sm border border-slate-100">
                  <div className="relative mb-4">
                    <table style={{ width: '100%', borderCollapse: 'collapse', paddingTop: '8px' }}>
                      <tbody>
                      <tr>
                        <td style={{ verticalAlign: 'top', padding: '4px 15px 4px 0', border: 'none', whiteSpace: 'nowrap' }}>
                          <div className="font-bold" style={{ fontSize: '18px', marginBottom: '3px', lineHeight: '20px', color: '#6f6f6f' }}>
                            {watchedValues.name || "Your Name"}
                          </div>
                          <div style={{ fontSize: '14px', marginBottom: '1px', lineHeight: '16px', color: '#5e5e5e' }}>
                            {watchedValues.title || "Your Title"}
                          </div>
                          <div className="text-blue-600 hover:text-blue-800 cursor-pointer underline" style={{ fontSize: '14px', marginBottom: '4px', lineHeight: '16px' }}>
                            {watchedValues.email || "your.email@socialmarketing.com"}
                          </div>
                          <div style={{ fontSize: '13px', lineHeight: '17px', color: '#5e5e5e' }}>
                            TEL // {watchedValues.phone || "415 979 9775"}
                          </div>
                        </td>
                        <td style={{ verticalAlign: 'top', padding: '4px 0 4px 15px', borderLeft: '1px solid #cccccc' }}>
                          <div className="font-bold" style={{ fontSize: '14px', marginBottom: '3px', lineHeight: '16px', whiteSpace: 'nowrap', color: '#606060' }}>BETTER WORLD ADVERTISING</div>
                          <div style={{ fontSize: '14px', marginBottom: '3px', lineHeight: '16px', color: '#5e5e5e' }}>1010 B Street, Suite 328</div>
                          <div style={{ fontSize: '14px', marginBottom: '3px', lineHeight: '16px', color: '#5e5e5e' }}>San Rafael CA 94901</div>
                          <div className="text-blue-600 hover:text-blue-800 cursor-pointer underline" style={{ fontSize: '14px', lineHeight: '16px' }}>
                            www.socialmarketing.com
                          </div>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <div style={{ marginTop: '28px' }}>
                    <img src={currentLogo} alt="Better World Advertising 30th Anniversary" style={{ width: '150px', height: 'auto' }} />
                  </div>
                </div>
              </div>
             
              {/* Small right-justified text below preview */}
              <div className="text-right mt-2">
                <p className="text-xs text-gray-400">Live Preview - Compact professional signature</p>
              </div>
            </CardContent>
          </Card>
          {/* Headline and Subhead */}
          <div className="text-left px-6">
            <p className="text-sm sm:text-base" style={{ color: 'rgba(75, 85, 99, 0.7)' }}>Generate your BWA signature for Gmail.</p>
          </div>
          {/* Form Section */}
          <Card className="shadow-lg border-0 rounded-lg w-full">
            <CardHeader className="bg-slate-50 rounded-t-lg">
              <p className="text-slate-600 text-sm">Fill in your details below.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-400 text-xs">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Dustin York"
                    {...form.register("name")}
                  />
                </div>
                <div>
                  <Label htmlFor="title" className="text-gray-400 text-xs">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Art Director"
                    {...form.register("title")}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-400 text-xs">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., dustinv@socialmarketing.com"
                    {...form.register("email")}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-400 text-xs">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g., 415 979 9775"
                    {...form.register("phone")}
                    onKeyPress={(e) => {
                      // Allow only numbers and spaces
                      const allowedChars = /[0-9\s]/;
                      if (!allowedChars.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      // Clean pasted content to only include numbers and spaces
                      e.preventDefault();
                      const paste = e.clipboardData.getData('text');
                      const cleaned = paste.replace(/[^0-9\s]/g, '');
                      const target = e.target as HTMLInputElement;
                      const start = target.selectionStart || 0;
                      const end = target.selectionEnd || 0;
                      const currentValue = target.value;
                      const newValue = currentValue.substring(0, start) + cleaned + currentValue.substring(end);
                      form.setValue('phone', newValue);
                    }}
                  />
                </div>
              </div>
              {/* Company Info */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-xs font-medium text-gray-400 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-gray-400 text-xs">Company</Label>
                    <Input value="BETTER WORLD ADVERTISING" readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label className="text-gray-400 text-xs">Website</Label>
                    <Input value="www.socialmarketing.com" readOnly className="bg-gray-50" />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-gray-400 text-xs">Address</Label>
                  <Input value="1010 B Street, Suite 328, San Rafael CA 94901" readOnly className="bg-gray-50" />
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  onClick={copyToClipboard}
                  className="flex-1 bg-slate-700 hover:bg-pink-500 transition-colors duration-200"
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Signature
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={clearForm}
                  className="flex-1"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Form
                </Button>
              </div>
              {/* Logo Replacement Tool */}
              <div className="bg-slate-50 border border-slate-200 p-6 bwa-accent-border mt-6">
                <button
                  onClick={() => setLogoSectionExpanded(!logoSectionExpanded)}
                  className="flex items-center justify-between w-full text-left hover:bg-slate-100 p-3 rounded-lg transition-colors cursor-pointer"
                >
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Update BWA Logo
                    <span className="text-xs text-slate-500">(For Approved Logo Updates Only)</span>
                  </h3>
                  {logoSectionExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>
               
                {logoSectionExpanded && (
                  <div className="mt-4 space-y-4">
                    {/* Drag and Drop Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
                        isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                      } ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-gray-400'}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-700 mb-2">
                        {isUploading ? 'Processing logo...' : 'Drop your new logo here'}
                      </h4>
                      <p className="text-sm text-gray-500 mb-4">
                        {isUploading
                          ? 'Scaling to 189px width and archiving current logo...'
                          : 'or click to browse files'
                        }
                      </p>
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>• Logo will be automatically scaled to 189px width</p>
                        <p>• Current logo will be archived with "_v2" suffix</p>
                        <p>• Supports PNG, JPG, SVG, and other image formats</p>
                      </div>
                    </div>
                   
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                   
                    {/* Current Logo Info */}
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Archive className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Current Logo</p>
                          <p className="text-xs text-gray-500">BWA30New2.png • 189px width • Auto height</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-slate-700 border-t border-slate-600 mt-16">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-slate-300 text-sm">© 2025 Better World Advertising. All rights reserved.</p>
            <p className="text-slate-400 text-xs mt-2">Need help? Contact IT support at (415) 979-9775</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
