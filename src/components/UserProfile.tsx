
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, MapPin, ShieldCheck, User } from 'lucide-react';

export const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.name?.slice(0, 2).toUpperCase() || 'U';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar_url} alt={user.name} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {user.email}
            {user.verified_email && (
              <Badge variant="secondary" className="text-green-600">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Verificado
              </Badge>
            )}
          </CardDescription>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{user.credits}</div>
          <div className="text-sm text-muted-foreground">Créditos</div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.first_name && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Nome:</strong> {user.first_name} {user.last_name}
              </span>
            </div>
          )}
          
          {user.locale && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Localização:</strong> {user.locale}
              </span>
            </div>
          )}
          
          {user.last_login_at && (
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Último login:</strong> {formatDate(user.last_login_at)}
              </span>
            </div>
          )}
          
          {user.login_count && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Total de logins:</strong> {user.login_count}
              </span>
            </div>
          )}
        </div>
        
        {user.google_id && (
          <div className="pt-4 border-t">
            <Badge variant="outline" className="text-xs">
              Conta conectada via Google (ID: {user.google_id.slice(0, 8)}...)
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
