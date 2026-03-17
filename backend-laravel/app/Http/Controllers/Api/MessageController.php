<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        return response()->json(Message::latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'message' => 'required|string|min:10',
        ]);

        $message = Message::create($data);

        return response()->json([
            'message' => 'Pesan berhasil dikirim! Terima kasih.',
            'data'    => $message,
        ], 201);
    }

    public function show(Message $message)
    {
        $message->update(['is_read' => true]);
        return response()->json($message);
    }

    public function destroy(Message $message)
    {
        $message->delete();
        return response()->json(['message' => 'Pesan berhasil dihapus.']);
    }

    public function stats()
    {
        return response()->json([
            'total_messages'  => Message::count(),
            'unread_messages' => Message::where('is_read', false)->count(),
        ]);
    }
}
