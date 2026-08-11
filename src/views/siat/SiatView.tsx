// import { useEffect, useState } from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Spinner } from '@/components/ui/spinner';
// import {
//   Search,
//   Filter,
//   RefreshCw,
//   CheckCircle,
//   AlertCircle,
//   Clock,
//   XCircle,
// } from 'lucide-react';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { getCatalogosSiatAction, sincronizarCatalogos, verificarComunicacionAction } from '@/actions/siat/siat.action';
// import { toast } from 'sonner';
// import type { CatalogoSiat } from '@/types/siat/siat';

// export interface CatalogoDetalle {
//   codigo: string;
//   descripcion: string;
//   vigente: boolean;
//   fechaSincronizacion: Date;
//   metadata?: Record<string, any>;
// }

// const CatalogosTable = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterEstado, setFilterEstado] = useState<string>('all');
//   const [syncing, setSyncing] = useState<string | null>(null);
//   const [activeSincronize, setActiveSincronize] = useState(false);
//   const queryClient = useQueryClient();

//   const { data: resVerificarComunicacion, isSuccess, isError } = useQuery({
//     queryKey: ['siat-verificarComunicaion'],
//     queryFn: verificarComunicacionAction,
//     retry: false,
//   });

//   useEffect(() => {
//     if (isSuccess) {
//       setActiveSincronize(true);
//     } else {
//       setActiveSincronize(false);
//     }
//   }, [resVerificarComunicacion, isSuccess, isError]);

//   const { mutate: mutateSincActividades } = useMutation({
//     mutationFn: sincronizarCatalogos,
//     onError: (error: TypeError) => {
//       toast.error(error.message);
//     },
//     onSuccess: (data) => {
//       console.log(data);
//     },
//   });

//   // Filtrar catálogos
//   // const filteredCatalogos = catalogos.filter((catalogo) => {
//   //   const matchesSearch =
//   //     catalogo.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //     catalogo.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

//   //   const matchesEstado =
//   //     filterEstado === 'all' || catalogo.estado === filterEstado;

//   //   return matchesSearch && matchesEstado;
//   // });

//   // Estado badges
//   const getEstadoBadge = (estado: CatalogoSiat['state']) => {
//     const config = {
//       sincronizado: {
//         variant: 'default' as const,
//         icon: <CheckCircle className="h-3 w-3 mr-1" />,
//         text: 'Sincronizado'
//       },
//       desactualizado: {
//         variant: 'secondary' as const,
//         icon: <Clock className="h-3 w-3 mr-1" />,
//         text: 'Desactualizado'
//       },
//       no_sincronizado: {
//         variant: 'outline' as const,
//         icon: <AlertCircle className="h-3 w-3 mr-1" />,
//         text: 'No sincronizado'
//       },
//       sincronizando: {
//         variant: 'default' as const,
//         icon: <RefreshCw className="h-3 w-3 mr-1 animate-spin" />,
//         text: 'Sincronizando'
//       },
//       error: {
//         variant: 'destructive' as const,
//         icon: <XCircle className="h-3 w-3 mr-1" />,
//         text: 'Error'
//       },
//     };

//     const { variant, icon, text } = config[estado];

//     return (
//       <Badge variant={variant} className="flex items-center w-fit">
//         {icon}
//         {text}
//       </Badge>
//     );
//   };

//   const { data: dataCatalogos = [] } = useQuery({
//     queryKey: ['catalogos-siat'],
//     queryFn: getCatalogosSiatAction,
//     retry: false
//   });

//   const { mutate: mutateSincCatalagos, isPending } = useMutation({
//     mutationFn: sincronizarCatalogos,
//     onMutate: async (method: string) => {
//       await queryClient.cancelQueries({ queryKey: ['catalogos-siat'] });
//       const previousCatalogos = queryClient.getQueryData(['catalogos-siat']);

//       // Optimistic update: actualizar UI inmediatamente
//       queryClient.setQueryData(['catalogos-siat'], (old: any[] | undefined) =>
//         old?.map(cat =>
//           cat.type === method
//             ? {
//                 ...cat,
//                 state: 'sincronizando',
//               }
//             : cat
//         ) || []
//       );

//       // Guardar para poder revertir en caso de error
//       return { previousCatalogos };
//     },
//     onError: (error: TypeError, method, context) => {
//       // Revertir el optimistic update en caso de error
//       if (context?.previousCatalogos) {
//         queryClient.setQueryData(['catalogos-siat'], context.previousCatalogos);
//       }

//       toast.error(error.message);
//     },

//     onSuccess: (data) => {
//       // Actualizar con datos reales del backend
//       queryClient.invalidateQueries({queryKey: ['catalogos-siat']});
//       // queryClient.setQueryData(['catalogos-siat'], (old: any[] | undefined) =>
//       //   old?.map(cat =>
//       //     cat.type === method
//       //       ? {
//       //           ...cat,
//       //           state: 'sincronizado',
//       //           lastSyncAt: new Date().toISOString(),
//       //           totalRegisters: data.totalRegistros || 0,
//       //           updatedAt: new Date().toISOString(),
//       //           // Si el backend devuelve los registros, actualizarlos
//       //           ...(data.registros && { registers: data.registros })
//       //         }
//       //       : cat
//       //   ) || []
//       // );

//       toast.success(data);

//       // Invalidar query para forzar refetch si es necesario
//       queryClient.invalidateQueries({ queryKey: ['catalogos-siat'] });
//     },
//     onSettled: () => {
//       setSyncing(null);
//     },
//   });

//   return (
//     <>
//       <Card className="w-full">

//         <CardHeader>
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             <CardTitle className="text-xl">
//               <div className='flex gap-2 items-center justify-center'>
//                 <h1 className="text-2xl lg:text-3xl font-bold">Catálogos SIAT </h1>

//                 <Badge variant={
//                   !resVerificarComunicacion ? 'outline' : resVerificarComunicacion === "COMUNICACION EXITOSA" ? 'default' : 'destructive'
//                 }>{!resVerificarComunicacion ? 'DESCONECTADO' : resVerificarComunicacion}</Badge>

//               </div>
//             </CardTitle>

//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
//               <div className="flex items-center relative">
//                 <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   type="search"
//                   placeholder="Buscar catálogo..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full lg:w-[300px] pl-9 bg-secondary/50 border-border text-sm"
//                 />
//               </div>

//               <Select value={filterEstado} onValueChange={setFilterEstado}>
//                 <SelectTrigger className="w-full sm:w-48">
//                   <Filter className="h-4 w-4 mr-2" />
//                   <SelectValue placeholder="Filtrar por estado" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">Todos los estados</SelectItem>
//                   <SelectItem value="sincronizado">Sincronizado</SelectItem>
//                   <SelectItem value="desactualizado">Desactualizado</SelectItem>
//                   <SelectItem value="no_sincronizado">No sincronizado</SelectItem>
//                   <SelectItem value="error">Con error</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent>
//           <div className="overflow-hidden rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[250px]">Catálogo</TableHead>
//                   <TableHead>Descripción</TableHead>
//                   <TableHead>Última Sincronización</TableHead>
//                   <TableHead>Registros</TableHead>
//                   <TableHead>Estado</TableHead>
//                   <TableHead className="text-right">Acciones</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {dataCatalogos.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={6} className="h-24 text-center">
//                       No se encontraron catálogos
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   dataCatalogos.map((catalogo) => (
//                     <TableRow key={catalogo._id}>
//                       <TableCell className="font-medium">
//                         <div className="flex flex-col">
//                           <span className="font-semibold">{catalogo.name}</span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="max-w-[300px] truncate">
//                         {catalogo.description}
//                       </TableCell>
//                       <TableCell>
//                         {catalogo.lastSyncAt ? catalogo.lastSyncAt : 's/n'}
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant="outline">
//                           {catalogo.totalRegisters} reg.
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         {getEstadoBadge(catalogo.state)}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">

//                           <Button
//                             size="sm"
//                             variant="default"
//                             onClick={() => mutateSincCatalagos(catalogo.type)}
//                             disabled={catalogo.state === 'sincronizando' || syncing === catalogo._id}
//                           >
//                             {catalogo.state === 'sincronizando' || syncing === catalogo._id ? (
//                               <Spinner className="h-4 w-4" />
//                             ) : (
//                               <RefreshCw className="h-4 w-4" />
//                             )}
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>

//           {/* <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
//             <div className="text-sm text-muted-foreground">
//               Mostrando {filteredCatalogos.length} de {catalogos.length} catálogos
//             </div>

//             <div className="flex items-center gap-4">
//               <Button variant="outline" size="sm" className="gap-2">
//                 <Download className="h-4 w-4" />
//                 Exportar Reporte
//               </Button>

//               <div className="flex gap-4 text-sm">
//                 <div className="flex items-center gap-1">
//                   <div className="h-2 w-2 rounded-full bg-green-500" />
//                   <span>Sincronizado: {catalogos.filter(c => c.estado === 'sincronizado').length}</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <div className="h-2 w-2 rounded-full bg-yellow-500" />
//                   <span>Pendiente: {catalogos.filter(c => c.estado !== 'sincronizado').length}</span>
//                 </div>
//               </div>
//             </div>
//           </div> */}
//         </CardContent>
//       </Card>
//     </>
//   );
// };

// export default CatalogosTable;
