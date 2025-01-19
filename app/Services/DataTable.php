<?php
namespace App\Services;
use App\Services\DataTables\DataTableExcel;
use App\Services\DataTables\DataTablePdf;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
class DataTable{
    protected $title;
    protected $request;

    protected $query;
    protected $queryRaw;
    public $no_page;
    protected $searchColumns;
    protected $exportOper=null;
    protected $classExport=[];
    public function __construct(Request $request){
        $this->request=$request;
        if($this->request->has('exportOper')){
            $this->exportOper=$this->request->input('exportOper');
        }
        $this->configClassExport();
    }

    public function configClassExport(){
        // $this->setClassExport('pdf',DataTablePdf::class)
        //     ->setClassExport('excel',DataTableExcel::class);
    }

    public function setClassExport($type,$class): DataTable{
        $this->classExport[$type]=$class;
        return $this;
    }

    public function setTitleExport($title): DataTable{
        $this->title=$title;
        return $this;
    }

    public function of($query){
        $this->query=$query;
    }

    public function getQueryRaw(){
        return  $this->queryRaw;
    }

    public function json(){
        $this->search()->filter()->sortBy();
        $this->queryRaw=$this->query;
        if($this->exportOper==null){
            return $this->paginate();
        }
        $this->export();
        exit();
    }

    public function setSearchColumns($columns): DataTable{
        $this->searchColumns=$columns;
        return $this;
    }

    public function getFieldSearch($field){
        $column=collect($this->searchColumns)->where('field',$field)->first();
        if(!is_null($column)){
            return $column['column'];
        }
        return $field;
    }

    public function search(): DataTable{
        // dd($this->request->input('search'));
        /*if($this->request->filled('columnFilters')){
            $columnFilters=$this->getColumnFilters();
            foreach($columnFilters as $key=>$value){
                $search=$key;
                if($this->searchColumns>0){
                    $search=$this->getFieldSearch($key);
                }
                $this->query->where($search,'ILIKE',$this->wildcards($value));
            }
        }*/
        if($this->request->filled('search')){
            $this->searchArguments()->each(function ($argument) {
                $this->query->where(function ($query) use ($argument) {
                    $this->match($query, $argument);
                });
            });
        }
        return $this;
    }

    private function searchArguments(): Collection{
        return collect(
            explode(' ', $this->request->get('search'))
        )->filter();
    }

    private function match($query, $argument){
        collect($this->request->input('columns'))
        ->each(function ($column) use ($query, $argument) {
            $search=$this->getFieldSearch($column);
            $query->orWhere(
                $search,
                'ilike',
                $this->wildcards($argument)
            );
        });
    }

    public function getColumnFilters(){
        $columnFilters = $this->request->input('columnFilters', []);
        return $this->parseJson($columnFilters);
    }

    public function parseJson($input,$assoc=true){
        if(is_string($input)){
            return json_decode($input,$assoc);
        }
        return $input;
    }

    public function filter():DataTable{
        return $this;
    }

    public function sortBy(): DataTable{
        if($this->request->filled('sort')){
            $sort=$this->parseJson($this->request->input('sort'));
            $sortField = $sort['field'];
            $sortType = $sort['sort'];
            if(!empty($sortField) && !empty($sortType)){
                $this->query->reorder($sortField,$sortType);
            }
        }
        return $this;
    }

    private function wildcards($argument): string{
        return '%'.mb_strtoupper($argument).'%';
    }

    public function noPage(){
        return $this->query->get();
    }

    public function make(): ?JsonResponse{
        $this->search()->filter()->sortBy();
        $this->queryRaw=$this->query;
        if($this->exportOper==null){
            return $this->renderJson();
        }
        $this->export();
        exit();
    }

    public function renderJson(): JsonResponse{
        return response()->json($this->paginate());
    }

    public function paginate(){
        return $this->query->paginate($this->request->input('perPage')??50);
    }

    public function export(): void{
        set_time_limit(0);
        $records=$this->query->get();
        $colModels=$this->parseJson($this->request->input('colModel'));
        if(is_null($this->title)){

            $this->title='Reporte '.$this->getTableTitle();
        }
        $classExport=$this->classExport[$this->exportOper]??null;
        if(is_null($classExport)){
            throw new \Exception('formato'.$this->classExport.' no soportado');
        }
        $exp=new $classExport();
        $exp->setTitle($this->title)->export($records,$colModels);
    }

    public function getTableTitle(): string{
        $table=$this->query->getModel()->getTable();
        $pos=strpos($table,'.');
        if($pos!==false){
            $table=substr($table,$pos+1,strlen($table));
        }
        return ucwords(str_replace(['-', '_'], ' ', $table));
    }
}
