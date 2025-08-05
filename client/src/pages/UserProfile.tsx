import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { User, Settings, Heart, Bell, Volume2, MapPin, Clock, Save } from "lucide-react";
import type { IUser } from "@shared/schema";
import RoutePlanner from "@/components/RoutePlanner";

export default function UserProfile() {
  const { t, language, changeLanguage } = useLanguage();
  const { user } = useAuth() as { user: IUser | undefined };

  const [profile, setProfile] = useState({
    name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    email: user?.email || "",
    phone: "",
    preferredLanguage: language,
    voiceSpeed: "normal",
    enableVoiceGuidance: true,
    enableNotifications: true,
    enableLocationServices: true,
    favoriteRoutes: [] as string[],
    frequentStops: [] as string[],
  });

  const [newFavoriteRoute, setNewFavoriteRoute] = useState("");
  const [newFrequentStop, setNewFrequentStop] = useState("");

  const handleSave = () => {
    console.log("Saving profile:", profile);
    // TODO: call API to persist profile changes
  };

  const addFavoriteRoute = () => {
    if (newFavoriteRoute.trim()) {
      setProfile((prev) => ({
        ...prev,
        favoriteRoutes: [...prev.favoriteRoutes, newFavoriteRoute.trim()],
      }));
      setNewFavoriteRoute("");
    }
  };

  const removeFavoriteRoute = (route: string) => {
    setProfile((prev) => ({
      ...prev,
      favoriteRoutes: prev.favoriteRoutes.filter((r) => r !== route),
    }));
  };

  const addFrequentStop = () => {
    if (newFrequentStop.trim()) {
      setProfile((prev) => ({
        ...prev,
        frequentStops: [...prev.frequentStops, newFrequentStop.trim()],
      }));
      setNewFrequentStop("");
    }
  };

  const removeFrequentStop = (stop: string) => {
    setProfile((prev) => ({
      ...prev,
      frequentStops: prev.frequentStops.filter((s) => s !== stop),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6" />
            User Profile & Preferences
          </h1>
          <p className="text-gray-600 mt-1">Customize your AddisBus Connect experience</p>
        </div>

        {/* Route Planner */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Plan Your Route
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <RoutePlanner />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Language & Voice Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Language & Voice Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">Preferred Language</Label>
                <Select
                  value={profile.preferredLanguage}
                  onValueChange={(value) => {
                    setProfile((prev) => ({ ...prev, preferredLanguage: value }));
                    changeLanguage(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                    <SelectItem value="om">Afaan Oromo</SelectItem>
                    <SelectItem value="ti">ትግርኛ (Tigrinya)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="voiceSpeed">Voice Speed</Label>
                <Select
                  value={profile.voiceSpeed}
                  onValueChange={(value) =>
                    setProfile((prev) => ({ ...prev, voiceSpeed: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="voiceGuidance">Enable Voice Guidance</Label>
                <Switch
                  id="voiceGuidance"
                  checked={profile.enableVoiceGuidance}
                  onCheckedChange={(checked) =>
                    setProfile((prev) => ({ ...prev, enableVoiceGuidance: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Get alerts about bus delays and updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={profile.enableNotifications}
                  onCheckedChange={(checked) =>
                    setProfile((prev) => ({ ...prev, enableNotifications: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="location">Location Services</Label>
                  <p className="text-sm text-gray-500">
                    Find nearby bus stops and routes
                  </p>
                </div>
                <Switch
                  id="location"
                  checked={profile.enableLocationServices}
                  onCheckedChange={(checked) =>
                    setProfile((prev) => ({ ...prev, enableLocationServices: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Favorite Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Favorite Routes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFavoriteRoute}
                  onChange={(e) => setNewFavoriteRoute(e.target.value)}
                  placeholder="Add a favorite route"
                />
                <Button onClick={addFavoriteRoute} size="sm">
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {profile.favoriteRoutes.length > 0 ? (
                  profile.favoriteRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">{route}</span>
                      <Button
                        onClick={() => removeFavoriteRoute(route)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No favorite routes added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Frequent Stops */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Frequent Stops
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFrequentStop}
                onChange={(e) => setNewFrequentStop(e.target.value)}
                placeholder="Add a frequent stop"
              />
              <Button onClick={addFrequentStop} size="sm">
                Add
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {profile.frequentStops.length > 0 ? (
                profile.frequentStops.map((stop, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{stop}</span>
                    <Button
                      onClick={() => removeFrequentStop(stop)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4 col-span-full">
                  No frequent stops added yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </main>
    </div>
  );
}
