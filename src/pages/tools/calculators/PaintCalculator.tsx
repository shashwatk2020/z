
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Paintbrush, Plus, Trash2, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Room {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
}

const PaintCalculator = () => {
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', name: 'Living Room', length: 12, width: 10, height: 9, doors: 2, windows: 3 }
  ]);
  const [paintType, setPaintType] = useState('interior');
  const [coats, setCoats] = useState(2);
  const [coverage, setCoverage] = useState(350);
  const [paintPrice, setPaintPrice] = useState(45);
  const [unit, setUnit] = useState('feet');
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const paintTypes = {
    interior: { coverage: 350, name: 'Interior Paint' },
    exterior: { coverage: 300, name: 'Exterior Paint' },
    primer: { coverage: 300, name: 'Primer' },
    ceiling: { coverage: 400, name: 'Ceiling Paint' }
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: `Room ${rooms.length + 1}`,
      length: 10,
      width: 10,
      height: 9,
      doors: 1,
      windows: 2
    };
    setRooms([...rooms, newRoom]);
  };

  const removeRoom = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const updateRoom = (id: string, field: keyof Room, value: string | number) => {
    setRooms(rooms.map(room => 
      room.id === id ? { ...room, [field]: value } : room
    ));
  };

  const calculatePaint = () => {
    if (rooms.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one room",
        variant: "destructive"
      });
      return;
    }

    let totalArea = 0;
    const roomDetails: any[] = [];

    rooms.forEach(room => {
      if (room.length <= 0 || room.width <= 0 || room.height <= 0) {
        return;
      }

      // Convert to feet if needed
      let length = room.length;
      let width = room.width;
      let height = room.height;

      if (unit === 'meters') {
        length *= 3.28084;
        width *= 3.28084;
        height *= 3.28084;
      }

      // Calculate wall area
      const wallArea = 2 * (length + width) * height;
      
      // Calculate ceiling area
      const ceilingArea = length * width;
      
      // Subtract door area (typically 20 sq ft each)
      const doorArea = room.doors * 20;
      
      // Subtract window area (typically 15 sq ft each)
      const windowArea = room.windows * 15;
      
      // Calculate net paintable area
      let paintableArea = wallArea - doorArea - windowArea;
      
      // Add ceiling if interior paint
      if (paintType === 'interior' || paintType === 'ceiling') {
        paintableArea += ceilingArea;
      }

      totalArea += paintableArea;
      
      roomDetails.push({
        name: room.name,
        wallArea: Math.round(wallArea),
        ceilingArea: Math.round(ceilingArea),
        doorArea,
        windowArea,
        paintableArea: Math.round(paintableArea)
      });
    });

    // Calculate paint needed
    const totalPaintableArea = totalArea * coats;
    const gallonsNeeded = totalPaintableArea / coverage;
    const gallonsToOrder = Math.ceil(gallonsNeeded);
    
    // Calculate costs
    const paintCost = gallonsToOrder * paintPrice;
    
    // Estimate additional supplies cost (brushes, rollers, drop cloths, etc.)
    const suppliesCost = gallonsToOrder * 15; // $15 per gallon in supplies
    
    const totalCost = paintCost + suppliesCost;

    // Time estimates (assuming 150 sq ft per hour)
    const paintingTimeHours = totalPaintableArea / 150;
    const prepTimeHours = paintingTimeHours * 0.5; // 50% of painting time for prep
    const totalTimeHours = paintingTimeHours + prepTimeHours;

    const paintResult = {
      totalArea: Math.round(totalArea),
      totalPaintableArea: Math.round(totalPaintableArea),
      gallonsNeeded: parseFloat(gallonsNeeded.toFixed(2)),
      gallonsToOrder,
      paintCost: parseFloat(paintCost.toFixed(2)),
      suppliesCost: parseFloat(suppliesCost.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      paintingTime: parseFloat(paintingTimeHours.toFixed(1)),
      prepTime: parseFloat(prepTimeHours.toFixed(1)),
      totalTime: parseFloat(totalTimeHours.toFixed(1)),
      roomDetails,
      costPerSqFt: parseFloat((totalCost / totalArea).toFixed(3))
    };

    setResult(paintResult);
    addToHistory(`${gallonsToOrder} gallons needed - $${totalCost.toFixed(2)} total cost`);
    
    toast({
      title: "Paint Calculated",
      description: `You need ${gallonsToOrder} gallons for ${Math.round(totalArea)} sq ft`
    });
  };

  const getSuppliesList = (gallons: number) => {
    return [
      { item: 'Paint brushes (2-3 sizes)', quantity: '1 set', cost: 25 },
      { item: 'Roller and covers', quantity: '1 set', cost: 20 },
      { item: 'Paint tray and liners', quantity: '1', cost: 15 },
      { item: 'Drop cloths', quantity: gallons > 3 ? '2' : '1', cost: gallons > 3 ? 30 : 15 },
      { item: 'Painter\'s tape', quantity: gallons > 3 ? '3 rolls' : '2 rolls', cost: gallons > 3 ? 15 : 10 },
      { item: 'Sandpaper/primer', quantity: '1 set', cost: 20 }
    ];
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Paint Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate how much paint you need for your project with cost estimates and supply lists.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paintbrush className="h-6 w-6" />
                  Paint Calculator
                </CardTitle>
                <CardDescription>Add rooms and calculate paint requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Paint Type</Label>
                    <Select value={paintType} onValueChange={(value) => {
                      setPaintType(value);
                      setCoverage(paintTypes[value as keyof typeof paintTypes].coverage);
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(paintTypes).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Coats</Label>
                    <Select value={coats.toString()} onValueChange={(value) => setCoats(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Coat</SelectItem>
                        <SelectItem value="2">2 Coats</SelectItem>
                        <SelectItem value="3">3 Coats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Coverage (sq ft/gallon)</Label>
                    <Input
                      type="number"
                      value={coverage}
                      onChange={(e) => setCoverage(parseInt(e.target.value) || 300)}
                      placeholder="Coverage"
                    />
                  </div>
                  <div>
                    <Label>Paint Price/Gallon ($)</Label>
                    <Input
                      type="number"
                      value={paintPrice}
                      onChange={(e) => setPaintPrice(parseFloat(e.target.value) || 0)}
                      placeholder="Price"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <Label>Measurement Unit</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feet">Feet</SelectItem>
                        <SelectItem value="meters">Meters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addRoom} variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Room
                  </Button>
                </div>

                <div>
                  <Label className="text-lg font-semibold mb-4 block">Rooms</Label>
                  <div className="space-y-4">
                    {rooms.map((room) => (
                      <div key={room.id} className="p-4 border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                          <div>
                            <Label className="text-sm">Room Name</Label>
                            <Input
                              value={room.name}
                              onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                              placeholder="Room name"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Length ({unit})</Label>
                            <Input
                              type="number"
                              value={room.length}
                              onChange={(e) => updateRoom(room.id, 'length', parseFloat(e.target.value) || 0)}
                              placeholder="Length"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Width ({unit})</Label>
                            <Input
                              type="number"
                              value={room.width}
                              onChange={(e) => updateRoom(room.id, 'width', parseFloat(e.target.value) || 0)}
                              placeholder="Width"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Height ({unit})</Label>
                            <Input
                              type="number"
                              value={room.height}
                              onChange={(e) => updateRoom(room.id, 'height', parseFloat(e.target.value) || 0)}
                              placeholder="Height"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Doors</Label>
                            <Input
                              type="number"
                              min="0"
                              value={room.doors}
                              onChange={(e) => updateRoom(room.id, 'doors', parseInt(e.target.value) || 0)}
                              placeholder="Doors"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Windows</Label>
                            <Input
                              type="number"
                              min="0"
                              value={room.windows}
                              onChange={(e) => updateRoom(room.id, 'windows', parseInt(e.target.value) || 0)}
                              placeholder="Windows"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button 
                              onClick={() => removeRoom(room.id)} 
                              variant="outline" 
                              size="sm"
                              className="w-full"
                              disabled={rooms.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={calculatePaint} className="w-full" size="lg">
                  Calculate Paint Needed
                </Button>

                {result && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {result.gallonsToOrder}
                      </div>
                      <div className="text-xl font-semibold text-blue-600 mb-2">
                        Gallons Needed
                      </div>
                      <div className="text-gray-600">
                        {result.gallonsNeeded} gallons calculated ({result.totalPaintableArea} sq ft total)
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-600 mb-2">Paint Cost</h4>
                        <div className="text-2xl font-bold text-green-600">${result.paintCost}</div>
                        <div className="text-sm text-gray-600">{result.gallonsToOrder} gallons</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-600 mb-2">Supplies Cost</h4>
                        <div className="text-2xl font-bold text-orange-600">${result.suppliesCost}</div>
                        <div className="text-sm text-gray-600">Estimated supplies</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-600 mb-2">Total Cost</h4>
                        <div className="text-2xl font-bold text-purple-600">${result.totalCost}</div>
                        <div className="text-sm text-gray-600">${result.costPerSqFt}/sq ft</div>
                      </div>
                    </div>

                    <Tabs defaultValue="rooms" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="rooms">Room Details</TabsTrigger>
                        <TabsTrigger value="supplies">Supplies List</TabsTrigger>
                        <TabsTrigger value="time">Time Estimate</TabsTrigger>
                      </TabsList>

                      <TabsContent value="rooms">
                        <div className="space-y-3">
                          {result.roomDetails.map((room: any, index: number) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                              <h5 className="font-semibold mb-2">{room.name}</h5>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div>Wall Area: {room.wallArea} sq ft</div>
                                <div>Ceiling Area: {room.ceilingArea} sq ft</div>
                                <div>Doors: -{room.doorArea} sq ft</div>
                                <div>Windows: -{room.windowArea} sq ft</div>
                              </div>
                              <div className="text-sm font-semibold mt-2">
                                Paintable Area: {room.paintableArea} sq ft
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="supplies">
                        <div className="space-y-3">
                          {getSuppliesList(result.gallonsToOrder).map((supply, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium">{supply.item}</div>
                                <div className="text-sm text-gray-600">Quantity: {supply.quantity}</div>
                              </div>
                              <div className="font-semibold">${supply.cost}</div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="time">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-yellow-600">{result.prepTime}h</div>
                            <div className="text-sm text-gray-600">Prep Work</div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">{result.paintingTime}h</div>
                            <div className="text-sm text-gray-600">Painting</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">{result.totalTime}h</div>
                            <div className="text-sm text-gray-600">Total Time</div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                          <h4 className="font-semibold mb-2">Project Timeline Tips</h4>
                          <ul className="text-sm space-y-1">
                            <li>• Day 1: Prep work (cleaning, taping, priming if needed)</li>
                            <li>• Day 2: First coat application</li>
                            <li>• Day 3: Second coat application (if needed)</li>
                            <li>• Allow 4+ hours between coats</li>
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Calculation History
                </CardTitle>
                <CardDescription>Recent paint calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No calculations yet</p>
                  ) : (
                    history.slice().reverse().map((calc, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        {calc}
                      </div>
                    ))
                  )}
                </div>
                {history.length > 0 && (
                  <Button 
                    onClick={() => setHistory([])} 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                  >
                    Clear History
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Paint Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>🎨 Buy 10-15% extra paint for touch-ups</div>
                  <div>🌡️ Paint in temperatures 50-85°F</div>
                  <div>💧 Avoid painting in high humidity</div>
                  <div>🕐 Apply thin, even coats</div>
                  <div>🧽 Clean brushes between coats</div>
                  <div>📏 Use quality brushes and rollers</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaintCalculator;
