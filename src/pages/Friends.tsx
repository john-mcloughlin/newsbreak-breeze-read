import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserCheck, UserPlus, X, Check, Undo } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for friends
type Friend = {
  id: string;
  username: string;
  status: "friend" | "pending" | "requested"; // friend = mutual, pending = they sent request, requested = you sent request
  avatarUrl?: string;
};

const Friends = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [myFriends, setMyFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const isMobile = useIsMobile();

  // Fetch mock data
  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockFriends: Friend[] = [
      { id: "f1", username: "emma_watson", status: "friend", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" },
      { id: "f2", username: "robert_smith", status: "friend", avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36" },
      { id: "f3", username: "alex_jones", status: "friend" },
    ];
    
    const mockPending: Friend[] = [
      { id: "p1", username: "john_doe", status: "pending", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" },
      { id: "p2", username: "sara_parker", status: "pending" },
    ];
    
    const mockSent: Friend[] = [
      { id: "r1", username: "mike_johnson", status: "requested" },
    ];
    
    setMyFriends(mockFriends);
    setPendingRequests(mockPending);
    setSentRequests(mockSent);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Mock search - in a real app, this would be an API call
    setTimeout(() => {
      // Mock results that might include existing friends
      const results: Friend[] = [
        { id: "s1", username: searchQuery.toLowerCase(), status: "pending" as const },
        { id: "f1", username: "emma_watson", status: "friend" as const, avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" },
        { id: "s3", username: `${searchQuery.toLowerCase()}_fan`, status: "requested" as const },
      ];
      
      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };

  const handleFriendAction = (userId: string, action: "add" | "accept" | "reject" | "remove" | "unsend") => {
    // In a real app, this would be an API call
    
    if (action === "add") {
      toast.success("Friend request sent!");
      // Update UI to show request sent
      setSearchResults(prev => prev.map(user => 
        user.id === userId ? { ...user, status: "requested" as const } : user
      ));
      const newFriend = searchResults.find(u => u.id === userId);
      if (newFriend) {
        setSentRequests(prev => [...prev, { ...newFriend, status: "requested" }]);
      }
    } 
    else if (action === "accept") {
      toast.success("Friend request accepted!");
      // Move from pending to friends
      const acceptedFriend = pendingRequests.find(request => request.id === userId);
      if (acceptedFriend) {
        setPendingRequests(prev => prev.filter(request => request.id !== userId));
        setMyFriends(prev => [...prev, { ...acceptedFriend, status: "friend" }]);
      }
    }
    else if (action === "reject") {
      toast.success("Friend request rejected");
      // Remove from pending
      setPendingRequests(prev => prev.filter(request => request.id !== userId));
    }
    else if (action === "remove") {
      toast.success("Friend removed");
      // Remove from friends
      setMyFriends(prev => prev.filter(friend => friend.id !== userId));
    }
    else if (action === "unsend") {
      toast.success("Friend request canceled");
      // Remove from sent requests
      setSentRequests(prev => prev.filter(request => request.id !== userId));
    }
  };

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const renderFriendItem = (friend: Friend, showActions = true) => (
    <div key={friend.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 rounded-md hover:bg-accent/10 transition-colors">
      <div className="flex items-center gap-3 mb-2 sm:mb-0">
        <Avatar>
          <AvatarImage src={friend.avatarUrl} />
          <AvatarFallback>{getInitials(friend.username)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{friend.username}</p>
          {friend.status === "friend" && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <UserCheck size={14} />
              <span>Friend</span>
            </div>
          )}
        </div>
      </div>
      
      {showActions && (
        <div className="ml-12 sm:ml-0">
          {friend.status === "friend" && (
            <Button variant="outline" size="sm" onClick={() => handleFriendAction(friend.id, "remove")}>
              {isMobile ? <X size={16} /> : "Remove"}
            </Button>
          )}
          {friend.status === "pending" && (
            <div className="flex gap-2">
              <Button variant="default" size="sm" onClick={() => handleFriendAction(friend.id, "accept")}>
                <Check size={16} />
                {!isMobile && <span className="ml-1">Accept</span>}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleFriendAction(friend.id, "reject")}>
                <X size={16} />
                {!isMobile && <span className="ml-1">Reject</span>}
              </Button>
            </div>
          )}
          {friend.status === "requested" && (
            <Button variant="outline" size="sm" onClick={() => handleFriendAction(friend.id, "unsend")}>
              {isMobile ? <Undo size={16} /> : "Unsend"}
            </Button>
          )}
          {!friend.status && (
            <Button variant="outline" size="sm" onClick={() => handleFriendAction(friend.id, "add")}>
              {isMobile ? <UserPlus size={16} /> : <><UserPlus size={14} className="mr-1" /> Add Friend</>}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="nb-container pt-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-nbText">Friends</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Section */}
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 mb-4">
              <Input
                type="text"
                placeholder="Search for friends by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Search Results</h3>
                <div className="divide-y divide-border">
                  {searchResults.map(user => renderFriendItem(user))}
                </div>
              </div>
            )}

            {searchQuery && !isSearching && searchResults.length === 0 && (
              <div className="text-center py-8">
                <Search className="mx-auto text-muted-foreground mb-2" size={32} />
                <p className="text-muted-foreground">No users found. Try a different search term.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Friends Management Section */}
        <div className="space-y-6">
          {/* Friend Requests */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Friend Requests</h3>
                {pendingRequests.length > 0 && (
                  <Badge>{pendingRequests.length}</Badge>
                )}
              </div>
              
              {pendingRequests.length > 0 ? (
                <div className="divide-y divide-border">
                  {pendingRequests.map(request => renderFriendItem(request))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No pending requests</p>
              )}
            </CardContent>
          </Card>
          
          {/* Sent Requests */}
          {sentRequests.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3">Sent Requests</h3>
                <div className="divide-y divide-border">
                  {sentRequests.map(request => renderFriendItem(request))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* My Friends Tab */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <h3 className="text-xl font-medium mb-4">My Friends ({myFriends.length})</h3>
          
          {myFriends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {myFriends.map(friend => renderFriendItem(friend))}
            </div>
          ) : (
            <div className="text-center py-10">
              <UserCheck size={48} className="mx-auto text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-medium mb-2">No friends yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Search for users and send friend requests to connect with them.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Friends;
