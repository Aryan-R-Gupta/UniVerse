'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Shield, Trophy } from "lucide-react";
import { sportsData, type Sport, type Fixture, type Standing } from "@/lib/data";

const FixtureCard = ({ fixture }: { fixture: Fixture }) => {
    const isLive = fixture.status === 'live';
    return (
        <Card className="bg-muted/50">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-muted-foreground">{fixture.time}</p>
                    {isLive && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                            <Flame className="h-3 w-3" /> Live
                        </Badge>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <span className="font-semibold">{fixture.teamA.name}</span>
                    </div>
                    <span className="font-bold text-lg">{fixture.teamA.score}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-500" />
                        <span className="font-semibold">{fixture.teamB.name}</span>
                    </div>
                    <span className="font-bold text-lg">{fixture.teamB.score}</span>
                </div>
            </CardContent>
        </Card>
    )
}

const StandingsTable = ({ standings }: { standings: Standing[] }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy /> Team Standings</CardTitle>
                <CardDescription>Current leaderboard for the university league.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">Pos</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead className="text-center">P</TableHead>
                            <TableHead className="text-center">W</TableHead>
                            <TableHead className="text-center">D</TableHead>
                            <TableHead className="text-center">L</TableHead>
                            <TableHead className="text-right">Pts</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {standings.map((team) => (
                            <TableRow key={team.position}>
                                <TableCell className="font-bold">{team.position}</TableCell>
                                <TableCell className="font-medium">{team.teamName}</TableCell>
                                <TableCell className="text-center">{team.played}</TableCell>
                                <TableCell className="text-center">{team.won}</TableCell>
                                <TableCell className="text-center">{team.drawn}</TableCell>
                                <TableCell className="text-center">{team.lost}</TableCell>
                                <TableCell className="text-right font-bold">{team.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


export default function SportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sports Tracker</h1>
        <p className="text-muted-foreground">Follow live scores, fixtures, and standings.</p>
      </div>

      <Tabs defaultValue="cricket" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cricket">Cricket</TabsTrigger>
          <TabsTrigger value="football">Football</TabsTrigger>
          <TabsTrigger value="basketball">Basketball</TabsTrigger>
        </TabsList>

        {Object.keys(sportsData).map(sportKey => {
            const sport = sportsData[sportKey as keyof typeof sportsData];
            return (
                <TabsContent key={sport.name} value={sportKey}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-4">
                             <h2 className="text-xl font-semibold">Live & Upcoming</h2>
                            {sport.fixtures.map(fixture => (
                                <FixtureCard key={fixture.id} fixture={fixture} />
                            ))}
                        </div>
                        <div className="lg:col-span-2">
                            <StandingsTable standings={sport.standings} />
                        </div>
                    </div>
                </TabsContent>
            )
        })}

      </Tabs>
    </div>
  );
}
