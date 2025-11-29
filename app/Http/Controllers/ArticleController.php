<?php
namespace App\Http\Controllers;
use App\Models\Article;
use App\Services\DataTable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
class ArticleController extends Controller{
    public function index(){
        return Inertia::render("Managements/Articles/Index");
    }

    public function store(Request $request){
        $article = Article::find($request->id);
        if(is_null($article)){
            $article=new Article();
        }
        $article->fill( $request->all());
        $article->save();
        return response()->json($article);
    }

    public function show(Article $article){
        return response()->json($article);
    }

    public function list(Request $request){
        $grid=new DataTable($request);
        $grid->of(Article::selectRaw("id,description")
        ->orderByDesc('id'));
        $result=$grid->json();
        return response()->json($result);
    }

    public function autocomplete(Request $request){
        $search='%'.Str::upper($request->input('search')).'%';
        $id = $request->id;
        $records=Article::select('id','description')
        ->where(function($query) use($id,$search){
            if($id){
                $query->where('id',$id);
            }else{
                $query->whereRaw("trim(description) ilike ?", [$search]);
            }
        })
        ->limit(12)
        ->get();
        return response()->json($records);
    }

    public function destroy(Article $article){
        $article->delete();
        return response()->json([
            'success' => true,
            'message' => 'Repuesto de reparación eliminado correctamente.'
        ]);
    }
}
