<?php

namespace App\Http\Controllers;

use App\Models\Materi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MateriController extends Controller
{
    public function index()
    {
        $materis = Materi::all();
        return view('materi.index', compact('materis'));
    }

    public function create()
    {
        return view('materi.tambahMateri');
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Upload gambar jika ada
        $gambarPath = null;
        if ($request->hasFile('gambar')) {
            $gambarPath = $request->file('gambar')->store('materi_gambar', 'public');
        }

        Materi::create([
            'judul' => $request->judul,
            'konten' => $request->konten,
            'gambar' => $gambarPath,
        ]);

        return redirect()->route('materi')->with('success', 'Materi berhasil ditambahkan');
    }

    public function edit($id)
    {
        $materi = Materi::findOrFail($id);
        return view('materi.editMateri', compact('materi'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $materi = Materi::findOrFail($id);

        // Jika user upload gambar baru, simpan yang baru
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada
            if ($materi->gambar && Storage::exists('public/' . $materi->gambar)) {
                Storage::delete('public/' . $materi->gambar);
            }

            $materi->gambar = $request->file('gambar')->store('materi_gambar', 'public');
        }

        $materi->judul = $request->judul;
        $materi->konten = $request->konten;
        $materi->save();

        return redirect()->route('materi')->with('success', 'Materi berhasil diperbarui');
    }

    public function destroy($id)
    {
        $materi = Materi::findOrFail($id);

        // Hapus gambar dari storage jika ada
        if ($materi->gambar && Storage::exists('public/' . $materi->gambar)) {
            Storage::delete('public/' . $materi->gambar);
        }

        $materi->delete();

        return redirect()->route('materi')->with('success', 'Materi berhasil dihapus');
    }
}
