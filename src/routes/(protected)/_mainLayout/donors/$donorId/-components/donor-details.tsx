import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { firestoreTimestampsConverter } from "@/lib/firestore-timestamps-converter";
import { DonorType, type Donor } from "@/types/donor";
import type { FirestoreTimestamps } from "@/types/general";

interface DonorDetailsProps {
  donor: Donor;
  showSkeletons: boolean
}

export function DonorDetails({ donor, showSkeletons }: DonorDetailsProps) {  
    const initials = !showSkeletons && donor?.fullName
      ? donor.fullName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
      : '??';
  
    const personalInfoItems = [
      { label: "Email", getValue: (d: typeof donor) => d?.email },
      { label: "Téléphone", getValue: (d: typeof donor) => d?.phoneNumber },
      { label: "Adresse", getValue: (d: typeof donor) => d?.address },
      { label: "Communication préférée", getValue: (d: typeof donor) => d?.communicationPreferences?.join(', ') || 'Non spécifiée' },
      { label: "Date d'adhésion", getValue: (d: typeof donor) => d?.createdAt ? firestoreTimestampsConverter(d.createdAt as FirestoreTimestamps) : "Non spécifiée" },
    ];
  
    const totalDonated = 15000;
    const lastDonation = "2023-06-15";
    const notes = !showSkeletons ? (donor?.notes || "Aucune note.") : null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Coordonnées et informations de base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                {showSkeletons ? (
                  <Skeleton className="h-16 w-16 rounded-full" />
                ) : (
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/placeholder.svg?height=64&width=64`} alt={donor?.fullName || ''} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  {showSkeletons ? <Skeleton className="h-6 w-40" /> : <h3 className="text-xl font-semibold">{donor?.fullName}</h3>}
                  <div className="flex items-center gap-2 mt-1">
                    {showSkeletons ? (
                      <>
                        <Skeleton className="h-5 w-20 rounded-md" />
                        <Skeleton className="h-5 w-16 rounded-md" />
                      </>
                    ) : donor && (
                      <>
                        <Badge variant={donor.donorType === DonorType.SPONSORSHIP ? "default" : "outline"}>
                          {donor.donorType === DonorType.SPONSORSHIP ? 'Parrainage' : 'Général'}
                        </Badge>
                        <Badge variant={donor.isActive ? "outline" : "destructive"}>
                          {donor.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
    
              <div className="space-y-3">
                {personalInfoItems.map((item, index) => (
                  <div key={index} className={`grid grid-cols-3 gap-1 ${index < personalInfoItems.length - 1 ? 'border-b pb-2' : ''}`}>
                    <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                    {showSkeletons ? (
                      <Skeleton className="col-span-2 h-4 w-full" />
                    ) : (
                      <span className="col-span-2 text-sm">{item.getValue(donor) || '-'}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
    
          <Card>
            <CardHeader>
              <CardTitle>Résumé des dons</CardTitle>
              <CardDescription>Historique et statistiques des dons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total des dons</p>
                  {showSkeletons ? <Skeleton className="h-8 w-32" /> : <p className="text-2xl font-bold">{totalDonated} MAD</p>}
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Dernier don</p>
                  {showSkeletons ? <Skeleton className="h-8 w-28" /> : (
                    <p className="text-2xl font-bold">
                      {new Date(lastDonation).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
    
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Notes</h4>
                {showSkeletons ? <Skeleton className="h-10 w-full" /> : <p className="text-sm text-muted-foreground break-words">{notes}</p>}
              </div>
    
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Statistiques des dons</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-1 border-b pb-2">
                    <span className="text-sm font-medium text-muted-foreground">Dons cette année</span>
                    {showSkeletons ? <Skeleton className="col-span-2 h-4 w-24" /> : <span className="col-span-2 text-sm">8,500 MAD</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-1 border-b pb-2">
                    <span className="text-sm font-medium text-muted-foreground">Dons l'année dernière</span>
                    {showSkeletons ? <Skeleton className="col-span-2 h-4 w-24" /> : <span className="col-span-2 text-sm">6,500 MAD</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-sm font-medium text-muted-foreground">Fréquence moyenne</span>
                    {showSkeletons ? <Skeleton className="col-span-2 h-4 w-24" /> : <span className="col-span-2 text-sm">Mensuelle</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
  )
}
